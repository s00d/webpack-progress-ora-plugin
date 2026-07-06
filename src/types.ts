import type { Options as OraOptions } from 'ora';

export interface ProgressOraPluginOptions extends Partial<OraOptions> {
  /** Pattern for the progress message. Use `:percent:` and `:text:` placeholders. */
  pattern?: string;
  /** Pattern character for the fallback progress bar when stderr is not a TTY. */
  pattern_no_stderr?: string;
  /** Re-render the spinner on every progress update. */
  update_render?: boolean;
  /** Clear the terminal when the build starts and ends. */
  clear?: boolean;
  /** Clear the terminal on every progress update. */
  clear_on_update?: boolean;
  /** Show a text progress bar when stderr is not a TTY. */
  stderr_check?: boolean;
  /** Output stream. Defaults to `process.stderr`. */
  stream?: NodeJS.WriteStream;
}

export interface ProgressRenderOptions {
  percent: number;
  completed: number;
  total: number;
}
