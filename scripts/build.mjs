import { rollup } from 'rollup';
import config from '../rollup.config.js';
const bundle = await rollup(config);
try {
  await bundle.write(config.output);
} finally {
  await bundle.close();
}
console.log('Build complete; Rollup resources closed.');
