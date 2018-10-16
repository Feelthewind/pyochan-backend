require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const authToken = require('src/lib/middlewares/authToken');
const api = require('src/api');
const { sequelize } = require('models');

const port = process.env.PORT || 4000;

const app = new Koa();
const router = new Router();
sequelize.sync();

app.use(
  cors({
    origin: (ctx) => {
      const validDomains = [
        'https://www.pyochan.com',
        'https://pyochan.com',
        'http://admin.pyochan.com',
        'http://www.admin.pyochan.com',
        'http://localhost:3000'
      ];
      if (validDomains.indexOf(ctx.request.header.origin) !== -1) {
        return ctx.request.header.origin;
      }
      return validDomains[0];
    },
    credentials: true
  })
);

app.use(authToken);
app.use(bodyParser());

router.use('/api', api.routes());
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log('listening to port ', port);
});
