import process from 'node:process';

import WebpackProgressOraPlugin from '../dist/index.js';

const delay = Number(process.argv[2] ?? 35);

const stages = [
  'setup compilation',
  'building modules',
  'sealing',
  'emitting',
  'optimizing',
];

const plugin = new WebpackProgressOraPlugin({ update_render: true });
const handler = plugin.handler;

if (!handler) {
  console.error('ProgressPlugin handler is not available');
  process.exit(1);
}

for (let i = 0; i <= 100; i += 1) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  const stage = stages[Math.min(stages.length - 1, Math.floor(i / 20))] ?? 'building';
  handler(i / 100, stage);
}
