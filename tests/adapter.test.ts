import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { filterRecent } from '../src/filter';

// A small host contract fixture exercises the real adapter, not Steam itself.
function host() {
  let route: (props: unknown) => unknown = (props) => props;
  let removed = 0, unpatched = 0;
  const reports: unknown[] = [];
  const api = { routerHook: {
    addPatch(_path: string, callback: typeof route) { route = callback; return callback; },
    removePatch() { removed++; },
  } };
  const ui = {
    afterPatch(target: { type: (...args: unknown[]) => unknown }, _key: string, callback: (args: unknown[], value: unknown) => unknown) {
      const original = target.type;
      target.type = (...args) => callback(args, original(...args));
      return { unpatch() { target.type = original; unpatched++; } };
    },
    findInReactTree(tree: unknown, predicate: (node: unknown) => boolean) {
      return predicate(tree) ? tree : undefined;
    },
  };
  const react = {
    isValidElement: (value: { props?: unknown } | null) => !!value?.props,
    cloneElement: (element: { props: object }, props: object) => ({ ...element, props: { ...element.props, ...props } }),
  };
  const source = readFileSync(new URL('../src/steamAdapter.ts', import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports: { installAdapter?: (report: (status: unknown) => void) => () => void } = {};
  const require = (name: string) => name === '@decky/api' ? api : name === '@decky/ui' ? ui : name === 'react' ? react : { filterRecent };
  const globals = { appStore: { GetAppOverviewByAppID: () => ({ per_client_data: [{ clientid: 0, installed: false }] }) } };
  new Function('require', 'exports', 'globalThis', code)(require, exports, globals);
  const stop = exports.installAdapter!((status) => reports.push(status));
  const holder = { type: 'holder', props: { games: [1], onItemFocus() {} } };
  const recentType = { type: () => holder as unknown };
  const recent = { type: recentType, props: { autoFocus: true, showBackground: true } };
  const homeType = { type: () => recent };
  const outer = { type: () => ({ type: homeType }) };
  function render() {
    route({ children: outer });
    outer.type(); homeType.type();
    return recentType.type();
  }
  return { stop, render, reports, holder, counts: () => ({ removed, unpatched }) };
}

test('empty Recent suppresses only the holder and cleanup is idempotent', async () => {
  const fixture = host();
  try {
    assert.equal(fixture.render(), null);
    await Promise.resolve();
    assert.deepEqual(fixture.reports, [{ message: 'Active', hidden: 1 }]);
    fixture.stop(); fixture.stop();
    assert.deepEqual(fixture.counts(), { removed: 1, unpatched: 3 });
    assert.equal(fixture.render(), fixture.holder);
  } finally { fixture.stop(); }
});

test('queued publication is ignored after unload', async () => {
  const fixture = host();
  try {
    fixture.render(); fixture.stop();
    await Promise.resolve();
    assert.deepEqual(fixture.reports, []);
  } finally { fixture.stop(); }
});
