// All private Steam UI assumptions live here. No Steam store writes.
import { afterPatch, findInReactTree } from '@decky/ui';
import { routerHook } from '@decky/api';
import { cloneElement, isValidElement, type ReactElement } from 'react';
import { filterRecent, type Overview } from './filter';

type Node = { type?: unknown; props?: Record<string, unknown> };
export interface Status { message: 'Waiting for Home' | 'Active' | 'Inactive — compatibility error'; hidden: number }
export const initialStatus: Status = { message: 'Waiting for Home', hidden: 0 };
export function installAdapter(report: (status: Status) => void): () => void {
  let active = true, sawHolder = false;
  let previous: Status = initialStatus;
  let lastError = '';
  let foundThisRender = false;
  const handles: { unpatch: () => void }[] = [];
  const patched = new WeakSet<object>();
  const errorLog = (reason: unknown) => console.error('[Clearly Recent]', String(reason));
  const publish = (status: Status) => {
    if (status.message === previous.message && status.hidden === previous.hidden) return;
    previous = status;
    queueMicrotask(() => { if (active) report(status); });
  };
  const fail = (reason: unknown) => {
    const message = String(reason);
    if (message !== lastError) { lastError = message; errorLog(message); }
    publish({ message: 'Inactive — compatibility error', hidden: 0 });
  };
  function patch(target: unknown, callback: (result: unknown) => unknown) {
    if (!target || (typeof target !== 'object' && typeof target !== 'function') || patched.has(target)) return;
    if (typeof (target as Node).type !== 'function') return;
    const handle = afterPatch(target as { type: (...args: unknown[]) => unknown }, 'type', (_args, result) => {
      if (!active) return result;
      try { return callback(result); } catch (error) { fail(error); return result; }
    });
    handles.push(handle);
    patched.add(target);
  }
  // Clone only the path to the games holder: Steam-owned props stay untouched.
  function transform(tree: unknown, depth = 0): unknown {
    if (depth > 50) return tree;
    if (Array.isArray(tree)) return tree.map((child) => transform(child, depth + 1));
    if (!isValidElement(tree)) return tree;
    const element = tree as ReactElement<Record<string, unknown>>;
    const props = element.props;
    if (Array.isArray(props.games) && typeof props.onItemFocus === 'function') {
      if (!props.games.every((id) => typeof id === 'number' && Number.isSafeInteger(id) && id > 0)) throw new Error('Unsupported Recent games format');
      const store = (globalThis as typeof globalThis & { appStore?: { GetAppOverviewByAppID?: (id: number) => Overview | undefined } }).appStore;
      if (!store?.GetAppOverviewByAppID) throw new Error('appStore unavailable');
      const result = filterRecent(props.games as number[], (id) => store.GetAppOverviewByAppID!(id));
      sawHolder = true;
      foundThisRender = true;
      publish({ message: 'Active', hidden: result.hidden });
      if (result.hidden === 0) return tree;
      // Native carousel assumes at least one item. Suppress only its holder
      // when empty; keep the surrounding Home and its other sections.
      return result.games.length ? cloneElement(element, { games: result.games }) : null;
    }
    if (!('children' in props)) return tree;
    return cloneElement(element, { children: transform(props.children, depth + 1) });
  }
  let route: ReturnType<typeof routerHook.addPatch> | undefined;
  try {
    route = routerHook.addPatch('/library/home', (props) => {
      if (!active) return props;
      try {
        patch(props.children, (first) => {
          patch((first as Node | null)?.type, (second) => {
            const recents = findInReactTree(second, (node: Node) => !!node?.props && 'autoFocus' in node.props && 'showBackground' in node.props) as Node | undefined;
            if (!recents) { fail('Steam UI structure not found: Recent'); return second; }
            patch(recents.type, (third) => {
              foundThisRender = false;
              const result = transform(third);
              if (!foundThisRender) fail('Steam UI structure not found: games holder');
              return result;
            });
            return second;
          });
          return first;
        });
      } catch (error) { fail(error); }
      return props;
    });
  } catch (error) { fail(error); }
  const timer = setTimeout(() => {
    if (active && !sawHolder) fail('Steam UI structure not found within compatibility timeout');
  }, 30000);
  return () => {
    if (!active) return;
    active = false;
    clearTimeout(timer);
    if (route) { try { routerHook.removePatch('/library/home', route); } catch (error) { errorLog(`Route cleanup failure: ${String(error)}`); } }
    for (const handle of handles.reverse()) { try { handle.unpatch(); } catch (error) { errorLog(`Component cleanup failure: ${String(error)}`); } }
  };
}
