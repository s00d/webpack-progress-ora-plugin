const chalk = require('chalk');
const webpack = require('webpack');
const ora = require('ora');
const ProgressBar = require('./ProgressBar');

const default_pattern = chalk.bold('[')+':percent:%'+chalk.bold('] ')+chalk.cyan.bold(':text:');

module.exports = function ProgressOraPlugin(options = {}) {

  options.pattern = options.pattern || default_pattern
  options.pattern_no_stderr = options.pattern_no_stderr || chalk.bold('█');
  options.update_render = options.update_render || false;
  options.clear = options.clear || false;
  options.clear_on_update = options.clear_on_update || false;
  const pb = new ProgressBar('Generate...', 20, options.pattern_no_stderr);
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
  let spinner = !stderr_check ? ora(options).start() : null;
  let isRunning = false;
  let startTime = 0;

  return new webpack.ProgressPlugin(function (percent, msg) {
    let newPercent = Math.ceil(percent * 100);

    if (!stderr_check) {
      if(options.clear_on_update) {
        stream.write('\x1Bc');
      }
      spinner.text = options.pattern.replace(/\:percent\:/, newPercent).replace(/\:text\:/, msg)
      if(options.update_render) {
        spinner.render();
      }
    } else {
      pb.render({
        percent: (newPercent / 100).toFixed(4),
        completed: newPercent,
        total: 100,
      })
    }

    if (!isRunning) {
      isRunning = true;
      startTime = new Date;
    } else if (percent >= 1) {
      let now = new Date;
      let buildTime = (now - startTime) / 1000 + 's';

      if(stderr_check) {
        stream.write('\n' +chalk.green('✓') + chalk.green.bold(' Build completed in ' + buildTime + '\n\n'));
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
