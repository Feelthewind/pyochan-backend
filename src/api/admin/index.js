const Router = require('koa-router');

const auth = require('./auth');
const lessons = require('./lessons');
const topics = require('./topics');

const admin = new Router();

admin.use('/auth', auth.routes());
admin.use('/lessons', lessons.routes());
admin.use('/topics', topics.routes());

module.exports = admin;
