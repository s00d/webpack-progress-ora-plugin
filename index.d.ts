import { Plugin } from 'webpack';

export default WebpackProgressOraPlugin;

declare class WebpackProgressOraPlugin extends Plugin {
    constructor(options: WebpackProgressOraPlugin.Options);
}

declare namespace WebpackProgressOraPlugin {
    interface Options {
        pattern: RegExp;
        pattern_no_stderr: string;
        update_render: boolean;
        clear: boolean;
        clear_on_update: boolean;
        text: string;
    }
}
