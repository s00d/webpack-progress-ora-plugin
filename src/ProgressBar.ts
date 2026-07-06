import logUpdate from 'log-update';

import type { ProgressRenderOptions } from './types.js';

export class ProgressBar {
  private readonly description: string;
  private readonly length: number;
  private lastCell = -1;
  private readonly pattern: string;

  constructor(description?: string, barLength?: number, pattern?: string) {
    this.description = description ?? 'Progress';
    this.length = barLength ?? 25;
    this.pattern = pattern ?? '█';
  }

  render(opts: ProgressRenderOptions): void {
    const cellNum = Math.floor(opts.percent * this.length);

    if (this.lastCell === cellNum || this.lastCell > cellNum) {
      return;
    }

    this.lastCell = cellNum;

    const cell = this.pattern.repeat(cellNum);
    const empty = '░'.repeat(this.length - cellNum);
    const percent = (100 * opts.percent).toFixed(2);
    const cmdText = `${this.description} ${percent}% ${cell}${empty} ${opts.completed}/${opts.total}`;

    logUpdate(cmdText);
  }
}
