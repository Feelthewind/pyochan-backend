const Router = require('koa-router');
const topicsCtrl = require('./topics.ctrl');

const topics = new Router();

topics.get('/', topicsCtrl.readTopics);
topics.get('/:id', topicsCtrl.readTopic);
topics.get('/season/:season', topicsCtrl.readSeasonTopics);
topics.post('/', topicsCtrl.write);
topics.patch('/:id', topicsCtrl.update);
topics.delete('/:id', topicsCtrl.remove);

module.exports = topics;
