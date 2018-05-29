const chalk = require('chalk');
const webpack = require('webpack');
const ora = require('ora');

const default_pattern = chalk.bold('[')+':percent:%'+chalk.bold('] ')+chalk.cyan.bold(':text:')

module.exports = function ProgressOraPlugin(options = {}) {
  options.pattern = options.pattern || default_pattern
  options.pattern_no_stderr = options.pattern_no_stderr || chalk.bold('▒');
  options.update_render = options.update_render || false;
  options.clear = options.clear || false;
  options.clear_on_update = options.clear_on_update || false;
  let stderr_check = false;
  let stream = options.stream || process.stderr;
  let enabled = stream && stream.isTTY;
  if (!enabled) {
    if (!options.stderr_check) {
      return function () {};
    }
    stderr_check = true;
  }

  if(options.clear && !stderr_check) {
    stream.write('\x1Bc');
  } else {
    stream.write('\n');
  }

  options.text = options.pattern.replace(/\:percent\:/, '0').replace(/\:text\:/, 'build start');
  let spinner = ora(options).start();

  let isRunning = false;
  let startTime = 0;
  let lastPercent = 0;

  return new webpack.ProgressPlugin(function (percent, msg) {
    let newPercent = Math.ceil(percent * 100);

    if (!stderr_check && lastPercent !== newPercent) {
      if(options.clear_on_update) {
        stream.write('\x1Bc');
      }
      spinner.text = options.pattern.replace(/\:percent\:/, newPercent).replace(/\:text\:/, msg)
      if(options.update_render) {
        spinner.render();
      }
      lastPercent = newPercent;
    }
    if(stderr_check && lastPercent !== newPercent) {
      let count = Math.floor((newPercent - lastPercent) / 5);
      if(count > 0) {
        if(lastPercent === 0) {
          stream.write(chalk.green.bold('______________________\n'))
          stream.write(chalk.green.bold('['))
        }
        stream.write(options.pattern_no_stderr.repeat(count));
        lastPercent = newPercent;
      }
    }

    if (!isRunning) {
      isRunning = true;
      startTime = new Date;
      lastPercent = 0;
    } else if (percent >= 1) {
      let now = new Date;
      let buildTime = (now - startTime) / 1000 + 's';

      if(stderr_check) {
        stream.write(chalk.green.bold(']')+'\n\n')
        stream.write(chalk.green.bold('\n\n'));
        stream.write(chalk.green('✓') + chalk.green.bold(' Build completed in ' + buildTime + '\n\n'));
      } else {
        spinner.stop();

        if(options.clear) {
          stream.write('\x1Bc');
        }
        spinner.succeed(chalk.green.bold('Build completed in ' + buildTime + '\n\n'))
      }
      isRunning = false;
    }
  });
};
