require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: 'mysql',
    database: 'likebaby',
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: 'false',
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  },
  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    database: 'likebaby',
    dialect: 'mysql',
    operatorsAliases: 'false',
    logging: false,
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  }
};
