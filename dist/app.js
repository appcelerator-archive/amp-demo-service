'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _atomiq = require('atomiq');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressBunyanLogger = require('express-bunyan-logger');

var _expressBunyanLogger2 = _interopRequireDefault(_expressBunyanLogger);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const log = debug('app');
var log = console.log;
var app = (0, _express2.default)();
var port = process.env.PORT || 3000;
var routesDir = _path2.default.join(__dirname, 'routes');

exports.default = app;

// provide express module to atomiq

app.set('express', _express2.default);

app.set('service', {
  name: _package2.default.name,
  version: _package2.default.version
});

// install middleware
app.use((0, _expressBunyanLogger2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));

// load routes
var loader = new _atomiq.DirectoryRouteLoader(app);
loader.load(routesDir);
app.use(loader.router);

// start listening when this is the main node module
if (require.main === module) {
  (function () {
    app.set('port', port);
    var server = app.listen(app.get('port'), function () {
      log('%s v%s listening on port %s', _package2.default.name, _package2.default.version, server.address().port);
      app.set('server', server);

      // close server gracefully...
      // handle ctrl-c
      exitOnSignal('SIGINT');
      // handle docker stop
      exitOnSignal('SIGTERM');

      function exitOnSignal(signal) {
        process.on(signal, function () {
          log('$(signal) received, stopping server...');
          server.close(function () {
            log('server stopped');
            process.exit();
          });
        });
      }
    });
  })();
}