const Router = require('koa-router');

const authCtrl = require('./auth.ctrl');

const auth = new Router();

auth.post('/login', authCtrl.adminLogin);

module.exports = auth;
