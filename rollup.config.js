import deckyPlugin from '@decky/rollup';
import ts from 'typescript';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const config = deckyPlugin();
// The template's TS watch-program leaves polling timers alive on this host.
// Type checking is a separate required step; transpile without a watch service.
config.plugins = config.plugins.map((plugin) => plugin.name === 'typescript' ? {
  name: 'typescript-transpile',
  resolveId(source, importer) {
    if (!importer || !source.startsWith('.')) return null;
    for (const extension of ['.ts', '.tsx']) {
      const file = resolve(dirname(importer), source + extension);
      if (existsSync(file)) return file;
    }
    return null;
  },
  transform(code, id) {
    if (!/\.tsx?$/.test(id)) return null;
    const result = ts.transpileModule(code, {
      fileName: id,
      compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, sourceMap: true },
    });
    return { code: result.outputText, map: result.sourceMapText ? JSON.parse(result.sourceMapText) : null };
  },
} : plugin);
config.output.sourcemap = false;
export default config;
