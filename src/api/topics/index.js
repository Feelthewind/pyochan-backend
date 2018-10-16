const Router = require('koa-router');
const topicsCtrl = require('./topics.ctrl');

const topics = new Router();

topics.get('/', topicsCtrl.read);
topics.post('/complete/:id', topicsCtrl.finish);

module.exports = topics;
