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
- stderr_check -  check stderr and show messege if not exist(default: folse)

```javascript
new WebpackProgressOraPlugin({
  stderr_check: true,
  interval: 300
})
```

## License

MIT
