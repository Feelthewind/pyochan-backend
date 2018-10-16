const Router = require('koa-router');
const lessonsCtrl = require('./lessons.ctrl');

const lessons = new Router();

lessons.get('/', lessonsCtrl.list);
lessons.get('/:id', lessonsCtrl.read);
lessons.post('/', lessonsCtrl.write);
lessons.patch('/:id', lessonsCtrl.update);
lessons.delete('/:id', lessonsCtrl.remove);
lessons.delete('/topic/:id', lessonsCtrl.removeAll);

module.exports = lessons;
