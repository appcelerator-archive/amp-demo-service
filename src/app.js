import bodyParser from 'body-parser';
import { DirectoryRouteLoader } from 'atomiq';
import express from 'express';
import expressBunyanLogger from 'express-bunyan-logger';
import path from 'path';
import pkg from '../package.json';
import log from './lib/log.js'

const app = express();
const port = process.env.PORT || 3000;
const routesDir = path.join(__dirname, 'routes');

export default app;

// provide express module to atomiq
app.set('express', express);

app.set('service', {
  name: pkg.name,
  version: pkg.version
});

// install middleware
app.use(expressBunyanLogger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// load routes
let loader = new DirectoryRouteLoader(app);
loader.load(routesDir);
app.use(loader.router);

log.info({ msgid: 'environment', env: process.env });

// start listening when this is the main node module
if (require.main === module) {
  app.set('port', port);
  const server = app.listen(app.get('port'), () => {
    log.info('%s v%s listening on port %s', pkg.name, pkg.version, server.address().port);
    app.set('server', server);

    // close server gracefully...
    // handle ctrl-c
    exitOnSignal('SIGINT');
    // handle docker stop
    exitOnSignal('SIGTERM');

    function exitOnSignal(signal) {
      process.on(signal, () => {
        log.info(`$(signal) received, stopping server...`);
        server.close(() => {
          log.info('server stopped');
          process.exit();
        });
      });
    }
  });
}
