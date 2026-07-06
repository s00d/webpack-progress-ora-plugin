import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ProgressPlugin } from 'webpack';

import ProgressOraPlugin from '../dist/index.js';
import { mockTtyStream, restoreStreamIsTTY } from './helpers.js';

function loop(progress: number, onLoop: (progress: number) => boolean): void {
  const finished = onLoop(progress);

  if (!finished) {
    process.nextTick(loop.bind(null, progress + 0.000003, onLoop));
  }
}

type ProgressHandler = NonNullable<ProgressPlugin['handler']>;

function getHandler(plugin: ProgressPlugin): ProgressHandler {
  const handler = plugin.handler;

  if (!handler) {
    throw new Error('ProgressPlugin handler is not available');
  }

  return handler;
}

describe('Ora Plugin', () => {
  const originalIsTTY = process.stderr.isTTY;

  beforeEach(() => {
    mockTtyStream(process.stderr);
  });

  afterEach(() => {
    restoreStreamIsTTY(process.stderr, originalIsTTY);
  });

  it('works with default options', async () => {
    const plugin = new ProgressOraPlugin({ update_render: true });
    const handler = getHandler(plugin);

    await new Promise<void>((resolve) => {
      handler(0, 'started');

      loop(0.01, (progress) => {
        if (progress < 1) {
          handler(progress, `progress: ${progress}`);
        } else {
          handler(1, 'finished');
          resolve();
        }

        return progress >= 1;
      });
    });

    expect(plugin).toBeDefined();
  });

  it('works with large debounce interval', async () => {
    const plugin = new ProgressOraPlugin({ interval: 1000, update_render: true });
    const handler = getHandler(plugin);

    await new Promise<void>((resolve) => {
      handler(0, 'started');

      loop(0.01, (progress) => {
        if (progress < 1) {
          handler(progress, `progress: ${progress}`);
        } else {
          handler(1, 'finished');
          resolve();
        }

        return progress >= 1;
      });
    });
  });

  it('works with small debounce interval', async () => {
    const plugin = new ProgressOraPlugin({ interval: 50, update_render: true });
    const handler = getHandler(plugin);

    await new Promise<void>((resolve) => {
      handler(0, 'started');

      loop(0.01, (progress) => {
        if (progress < 1) {
          handler(progress, `progress: ${progress}`);
        } else {
          handler(1, 'finished');
          resolve();
        }

        return progress >= 1;
      });
    });
  });

  it('works with extraneous console output', async () => {
    const plugin = new ProgressOraPlugin({ interval: 50, update_render: true, clear: true });
    const handler = getHandler(plugin);
    let i = 0;

    await new Promise<void>((resolve) => {
      handler(0, 'started');

      console.log('extraneous message on start 1 of 2');
      console.log('extraneous message on start 2 of 2');

      loop(0.01, (progress) => {
        if (progress < 1) {
          handler(progress, `progress: ${progress}`);
        } else {
          handler(1, 'finished');
          console.log('extraneous message on end 1 of 2');
          console.log('extraneous message on end 2 of 2');
          resolve();
        }

        if (i === 1000) {
          console.log('extraneous message on progress 1 of 4');
          console.log('extraneous message on progress 2 of 4');
          console.log('extraneous message on progress 3 of 4');
          console.log('extraneous message on progress 4 of 4');
        }

        i += 1;
        return progress >= 1;
      });
    });
  });

  it('works with long extraneous console output', async () => {
    const plugin = new ProgressOraPlugin({
      interval: 50,
      update_render: true,
      clear: true,
      clear_on_update: true,
    });
    const handler = getHandler(plugin);
    let i = 0;

    await new Promise<void>((resolve) => {
      handler(0, 'started');

      console.log('extraneous message on start');

      loop(0.01, (progress) => {
        if (progress < 1) {
          handler(progress, `progress: ${progress}`);
        } else {
          handler(1, 'finished');
          console.log('extraneous message on end');
          resolve();
        }

        if (i === 1000) {
          for (let j = 1; j <= 50; j += 1) {
            console.log(`extraneous message on progress ${j} of 50`);
          }
        }

        i += 1;
        return progress >= 1;
      });
    });
  });

  it('works with time', async () => {
    const plugin = new ProgressOraPlugin({ clear: true });
    const handler = getHandler(plugin);

    await new Promise<void>((resolve) => {
      handler(0, 'started');

      let progress = 0;
      const timeout = setInterval(() => {
        progress += 0.003;

        if (progress < 1) {
          process.nextTick(() => handler(progress, `progress: ${progress}`));
        } else {
          process.nextTick(() => {
            handler(progress, 'finished');
            clearInterval(timeout);
            resolve();
          });
        }
      }, 3);
    });
  });

  it('works without TTY', async () => {
    restoreStreamIsTTY(process.stderr, false);

    const plugin = new ProgressOraPlugin({
      update_render: true,
      clear: true,
      stderr_check: true,
    });
    const handler = getHandler(plugin);

    await new Promise<void>((resolve) => {
      handler(0, 'started');

      let progress = 0;
      const timeout = setInterval(() => {
        progress += 0.003;

        if (progress < 1) {
          process.nextTick(() => handler(progress, `progress: ${progress}`));
        } else {
          process.nextTick(() => {
            handler(progress, 'finished');
            clearInterval(timeout);
            resolve();
          });
        }
      }, 3);
    });
  });
});
