import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import webpack from 'webpack';

import { ProgressBar } from './ProgressBar.js';
import type { ProgressOraPluginOptions } from './types.js';

const defaultPattern =
  chalk.bold('[') + ':percent:%' + chalk.bold('] ') + chalk.cyan.bold(':text:');

function formatPattern(pattern: string, percent: number | string, text: string): string {
  return pattern.replace(/:percent:/g, String(percent)).replace(/:text:/g, text);
}

function createProgressOraPlugin(options: ProgressOraPluginOptions = {}): webpack.ProgressPlugin {
  const pattern = options.pattern ?? defaultPattern;
  const patternNoStderr = options.pattern_no_stderr ?? chalk.bold('█');
  const updateRender = options.update_render ?? false;
  const clear = options.clear ?? false;
  const clearOnUpdate = options.clear_on_update ?? false;

  const pb = new ProgressBar('Generate...', 20, patternNoStderr);
  let stderrCheck = false;
  const stream = options.stream ?? process.stderr;
  const enabled = Boolean(stream?.isTTY);

  if (!enabled) {
    if (!options.stderr_check) {
      return new webpack.ProgressPlugin(() => {});
    }
    stderrCheck = true;
  }

  if (clear && !stderrCheck) {
    stream.write('\x1Bc');
  } else {
    stream.write('\n');
  }

  const oraOptions: ProgressOraPluginOptions = {
    ...options,
    text: formatPattern(pattern, 0, 'build start'),
  };

  const spinner: Ora | null = !stderrCheck ? ora(oraOptions).start() : null;
  let isRunning = false;
  let startTime = 0;

  return new webpack.ProgressPlugin((percent, msg) => {
    const newPercent = Math.ceil(percent * 100);

    if (!stderrCheck && spinner) {
      if (clearOnUpdate) {
        stream.write('\x1Bc');
      }

      spinner.text = formatPattern(pattern, newPercent, msg);

      if (updateRender) {
        spinner.render();
      }
    } else {
      pb.render({
        percent: newPercent / 100,
        completed: newPercent,
        total: 100,
      });
    }

    if (!isRunning) {
      isRunning = true;
      startTime = Date.now();
    } else if (percent >= 1) {
      const buildTime = `${(Date.now() - startTime) / 1000}s`;

      if (stderrCheck) {
        stream.write(`\n${chalk.green('✓')}${chalk.green.bold(` Build completed in ${buildTime}\n\n`)}`);
      } else if (spinner) {
        spinner.stop();

        if (clear) {
          stream.write('\x1Bc');
        }

        spinner.succeed(chalk.green.bold(`Build completed in ${buildTime}\n\n`));
      }

      isRunning = false;
    }
  });
}

interface ProgressOraPlugin {
  (options?: ProgressOraPluginOptions): webpack.ProgressPlugin;
  new (options?: ProgressOraPluginOptions): webpack.ProgressPlugin;
}

const ProgressOraPlugin = createProgressOraPlugin as ProgressOraPlugin;

export default ProgressOraPlugin;
export type { ProgressOraPluginOptions, ProgressRenderOptions } from './types.js';
