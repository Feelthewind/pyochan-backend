const Router = require('koa-router');
const lessons = require('./lessons');
const topics = require('./topics');
const auth = require('./auth');
const admin = require('./admin');
const subscription = require('./subscription');

const api = new Router();

api.use('/admin', admin.routes());
api.use('/lessons', lessons.routes());
api.use('/topics', topics.routes());
api.use('/auth', auth.routes());
api.use('/subscription', subscription.routes());

module.exports = api;
