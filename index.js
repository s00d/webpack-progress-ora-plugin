const chalk = require('chalk');
const webpack = require('webpack');
const ora = require('ora');


module.exports = function ProgressOraPlugin(options = {}) {
    options.pattern = options.pattern || chalk.bold('[') + ':percent:%' + chalk.bold('] ') + chalk.cyan.bold(':text:')
    options.pattern_no_stderr = options.pattern_no_stderr || chalk.bold('▒');
    options.rerander = options.rerander || false;
    options.clear = options.clear || false;
    options.clear = options.clear_on_update || false;
    let stderr_check = false;
    let stream = options.stream || process.stderr;
    let enabled = stream && stream.isTTY;
    if (!enabled) {
        if (!options.stderr_check) {
            return function () {};
        }
        stderr_check = true;
    }
    
    if(!stderr_check & options.clear) {
        process.stdout.write('\x1Bc');
    }
    options.text = options.pattern.replace(/\:percent\:/, '0').replace(/\:text\:/, 'build start');
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

        if (lastPercent !== newPercent || (options.clear && !stderr_check)) {
            if(!stderr_check && options.clear) {
                process.stdout.write('\x1Bc');
            }
            spinner.text = options.pattern.replace(/\:percent\:/, newPercent).replace(/\:text\:/, msg)
            if(stderr_check) {
                stream.write(options.pattern_no_stderr);
            } else if(options.rerander) {
                spinner.render();
            }
            lastText = msg;
            lastPercent = newPercent;
        }

        if (!running) {
            running = true;
            startTime = new Date;
            lastPercent = 0;
        } else if (percent >= 1) {
            let now = new Date;
            let buildTime = (now - startTime) / 1000 + 's';

            spinner.stop();

            if(stderr_check) {
                stream.write(chalk.green.bold('\n\n'));
                stream.write(chalk.green.bold('Build completed in ' + buildTime + '\n\n'));
            } else {
                if(options.clear_on_update) {
                    process.stdout.write('\x1Bc');
                }
                spinner.succeed(chalk.green.bold('Build completed in ' + buildTime + '\n\n'))
            }
            running = false;
        }
    });
};
