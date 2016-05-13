import { Route } from 'atomiq';

// /ping
export default class Ping extends Route {

  // GET /ping
  get(req, res) {
    console.log('pong')
    req.log.info('pong')
    res.json(req.app.get('service'))
  }

}
