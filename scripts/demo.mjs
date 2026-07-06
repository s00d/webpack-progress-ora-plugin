import process from 'node:process';

import WebpackProgressOraPlugin from '../dist/index.js';
import { mockNonTtyStream, mockTtyStream } from './demo-helpers.mjs';

const mode = process.argv[2] ?? 'spinner';
const delay = Number(process.argv[3] ?? 40);

if (mode === 'bar') {
  mockNonTtyStream(process.stderr);
} else {
  mockTtyStream(process.stderr);
}

const options =
  mode === 'bar'
    ? { stderr_check: true, update_render: true }
    : { update_render: true, clear: mode === 'clear' };

const plugin = new WebpackProgressOraPlugin(options);
const handler = plugin.handler;

if (!handler) {
  console.error('ProgressPlugin handler is not available');
  process.exit(1);
}

for (let i = 0; i <= 100; i += 1) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  handler(i / 100, `building ${i}%`);
}
