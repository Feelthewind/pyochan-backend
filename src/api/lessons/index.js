const Router = require('koa-router');
const lessonsCtrl = require('./lessons.ctrl');

const lessons = new Router();

lessons.get('/', lessonsCtrl.list);
lessons.get('/check', lessonsCtrl.check);
lessons.get('/review', lessonsCtrl.list);
lessons.post('/like/:id', lessonsCtrl.likeLesson);
lessons.post('/unlike/:id', lessonsCtrl.unlikeLesson);

module.exports = lessons;
