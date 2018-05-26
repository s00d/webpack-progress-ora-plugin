var WebpackProgressOraPlugin = require('../index');

function loop(progress, onLoop) {
  var finished = onLoop(progress);

  if (!finished) {
    progress += 0.000003;
    process.nextTick(loop.bind(null, progress, onLoop))
  }
}
describe('Ora Plugin', function() {
  this.timeout(10000);

  it('works with default options', function(done) {
    var plugin = new WebpackProgressOraPlugin({rerander: true});
    plugin.handler(0, 'started');

    loop(0.01, function(progress) {
      if (progress < 1) {
        plugin.handler(progress, 'progress: ' + progress);
      } else {
        plugin.handler(1, 'finished');
        done();
      }

      return progress >= 1;
    });
  });

  it('works with large debounce interval', function(done) {
    var plugin = new WebpackProgressOraPlugin({ interval: 1000, rerander: true });
    plugin.handler(0, 'started');

    loop(0.01, function(progress) {
      if (progress < 1) {
        plugin.handler(progress, 'progress: ' + progress);
      } else {
        plugin.handler(1, 'finished');
        done();
      }

      return progress >= 1;
    });
  });

  it('works with small debounce interval', function(done) {
    var plugin = new WebpackProgressOraPlugin({ interval: 50, rerander: true });
    plugin.handler(0, 'started');

    loop(0.01, function(progress) {
      if (progress < 1) {
        plugin.handler(progress, 'progress: ' + progress);
      } else {
        plugin.handler(1, 'finished');
        done();
      }

      return progress >= 1;
    });
  });

  /* eslint-disable no-console */
  it('works with extraneous console output', function(done) {
    var plugin = new WebpackProgressOraPlugin({ interval: 50, rerander: true, clear: true });
    plugin.handler(0, 'started');
    var i = 0;

    console.log('extraneous message on start 1 of 2');
    console.log('extraneous message on start 2 of 2');

    loop(0.01, function(progress) {
      if (progress < 1) {
        plugin.handler(progress, 'progress: ' + progress);
      } else {
        plugin.handler(1, 'finished');
        console.log('extraneous message on end 1 of 2');
        console.log('extraneous message on end 2 of 2');
        done();
      }
      if (i === 1000) {
        console.log('extraneous message on progress 1 of 4');
        console.log('extraneous message on progress 2 of 4');
        console.log('extraneous message on progress 3 of 4');
        console.log('extraneous message on progress 4 of 4');
      }
      i++;
      return progress >= 1;
    });
  });
  /* eslint-disable no-console */
  it('works with long extraneous console output', function(done) {
    var plugin = new WebpackProgressOraPlugin({ interval: 50, rerander: true, clear: true, clear_on_update: true });
    plugin.handler(0, 'started');
    var i = 0;

    console.log('extraneous message on start');

    loop(0.01, function(progress) {
      if (progress < 1) {
        plugin.handler(progress, 'progress: ' + progress);
      } else {
        plugin.handler(1, 'finished');
        console.log('extraneous message on end');
        done();
      }
      if (i === 1000) {
        for (var j = 1; j <= 50; j++) {
          console.log('extraneous message on progress ' + j + ' of 50');
        };
      }
      i++;
      return progress >= 1;
    });
  });

  it('works with time', function(done) {
    var plugin = new WebpackProgressOraPlugin({rerander: true, clear: true, clear_on_update: true});
    plugin.handler(0, 'started');

    let progress = 0;
    let timeout = setInterval(() => { 
      progress += 0.003;
      if (progress < 1) {
        process.nextTick(() => plugin.handler(progress, 'progress: ' + progress))
      } else {
        process.nextTick(() => plugin.handler(progress, 'finished'))
        clearInterval(timeout);
        done();
      }
    }, 3)
  });

  it('works without TTY', function(done) {
    var stream = process.stderr;
    stream.isTTY = false;
    var plugin = new WebpackProgressOraPlugin({rerander: true, clear: true, stderr_check: true});
    plugin.handler(0, 'started');

    let progress = 0;
    let timeout = setInterval(() => { 
      progress += 0.003;
      if (progress < 1) {
        process.nextTick(() => plugin.handler(progress, 'progress: ' + progress))
      } else {
        process.nextTick(() => plugin.handler(progress, 'finished'))
        clearInterval(timeout);
        done();
      }
    }, 3)
  });
});
