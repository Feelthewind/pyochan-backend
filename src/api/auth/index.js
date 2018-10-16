const Router = require('koa-router');

const authCtrl = require('./auth.ctrl');

const auth = new Router();

auth.post('/register/local', authCtrl.createLocalAccount);
auth.post('/login/local', authCtrl.localLogin);
auth.get('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);

module.exports = auth;
