const slog = require('single-line-log').stdout;

module.exports = function ProgressBar(description, bar_length, pattern) {
  this.description = description || 'Progress';
  this.length = bar_length || 25;
  this.lastcell = -1;
  this.pattern = pattern;
  this.render = function (opts) {
    const cell_num = Math.floor(opts.percent * this.length);
    if (this.lastcell === cell_num) return;
    if (this.lastcell > cell_num) return;
    this.lastcell = cell_num;
    let cell = '';
    for (let i = 0; i < cell_num; i++) {
      cell += this.pattern;
    }
    let empty = '';
    for (let i = 0; i < this.length - cell_num; i++) {
      empty += '░';

    }
    const cmdText = this.description + ' ' + (100 * opts.percent).toFixed(2) + '% ' + cell + empty + ' ' + opts.completed + '/' + opts.total;
    slog(cmdText);
  };
};
