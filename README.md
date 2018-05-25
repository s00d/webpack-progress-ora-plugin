# webpack-progress-ora-plugin
![webpack-progress-ora-plugin](https://github.com/s00d/webpack-progress-ora-plugin/raw/master/image.gif)

## Installation

```
npm i -D webpack-progress-ora-plugin
```

## Usage

Include the following in your Webpack config.

```javascript
var WebpackProgressOraPlugin = require('webpack-progress-ora-plugin');

...

plugins: [
  new WebpackProgressOraPlugin()
]
```

## Options

Accepts almost all of the same options as [ora](https://github.com/sindresorhus/ora#options).

additional
- pattern - pattern for message(default: chalk.bold('[') + ':percent:%' + chalk.bold('] ') + chalk.cyan.bold(':text:')), params: :percent: - percent complete; :text: - build stage
- stderr_check - check stderr and show message if not exist(default: false)
- pattern_no_stderr -(default: ▒)


```javascript
new WebpackProgressOraPlugin({
  stderr_check: true,
  interval: 300
})
```

## License

MIT
