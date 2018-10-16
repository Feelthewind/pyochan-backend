const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('config/config')[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Lesson = require('./lesson')(sequelize, Sequelize);
db.Topic = require('./topic')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);
db.Subscription = require('./subscription')(sequelize, Sequelize);

db.Topic.hasMany(db.Lesson);
db.Lesson.belongsTo(db.Topic);
db.User.belongsToMany(db.Lesson, { through: 'LessonUser' });
db.Lesson.belongsToMany(db.User, { through: 'LessonUser' });
db.User.belongsToMany(db.Topic, { through: 'TopicUser' });
db.Topic.belongsToMany(db.User, { through: 'TopicUser' });
db.User.belongsToMany(db.Topic, {
  through: 'TopicComplete',
  as: 'Ctopics'
});
db.Topic.belongsToMany(db.User, {
  through: 'TopicComplete',
  as: 'Finishers'
});

module.exports = db;
