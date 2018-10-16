const Router = require('koa-router');
const subsCtrl = require('./subscription.ctrl');

const subs = new Router();

subs.post('/register', subsCtrl.register);

module.exports = subs;
