const chalk = require('chalk');
const webpack = require('webpack');
const ora = require('ora');


module.exports = function ProgressOraPlugin(options = {}) {
    let stderr_check = false;
    let stream = options.stream || process.stderr;
    let enabled = stream && stream.isTTY;
    if (!enabled) {
        if (!options.stderr_check) {
            return function () {};
        }
        stderr_check = true;
    }

    options.text = chalk.bold('[') + '0%' + chalk.bold('] ') + chalk.cyan.bold('build start');
    let spinner = ora(options).start();

    let running = false;
    let startTime = 0;
    let lastPercent = 0;
    let lastText = '';

    return new webpack.ProgressPlugin(function (percent, msg) {
        if (!running && lastPercent !== 0) {
            stream.write('\n');
        }

        let newPercent = Math.ceil(percent * 100);

        if (lastPercent !== newPercent) {
            spinner.text = chalk.bold('[') + newPercent + '%' + chalk.bold('] ') + chalk.cyan.bold(msg)
            if(stderr_check && lastText !== msg) {
                stream.write(chalk.bold('[') + newPercent + '%' + chalk.bold('] ') + chalk.cyan.bold(msg) + '\n');
            }
            lastText = msg;
            lastPercent = newPercent;
        }

        if (!running) {
            running = true;
            startTime = new Date;
            lastPercent = 0;
        } else if (percent === 1) {
            let now = new Date;
            let buildTime = (now - startTime) / 1000 + 's';

            spinner.stop();

            stream.write(chalk.green.bold('Build completed in ' + buildTime + '\n\n'));
            running = false;
        }
    });
};
