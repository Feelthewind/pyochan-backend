const { Topic, Subscription } = require('models');
const { authAdmin } = require('src/lib/authAdmin');
const webpush = require('web-push');

exports.write = async (ctx) => {
  const { authorization: token } = ctx.headers; // 음..
  const isAuthenticated = await authAdmin(ctx, token);
  if (!isAuthenticated) {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized'
    };
    return;
  }

  const {
    topic, day, season, desc
  } = ctx.request.body;
  try {
    const newTopic = await Topic.create({
      topic,
      day,
      season,
      desc
    });

    ctx.body = newTopic;

    webpush.setVapidDetails(
      'mailto:admin@pyochan.com',
      'BNmTh0HBy8K8QEg6XPha2_ufRo_4ixyxrNV-xy3_6cC34yHVq01bIUDabw7JSrC6XxbgMaVMDqWQkI5b8xewJ9E',
      'd-Y6v9-_pft8NUYPl24Op3qm1IjlSnyKf2WINhxIPYQ'
    );
    const subscriptions = await Subscription.findAll({});
    subscriptions.forEach((sub) => {
      const { endpoint, auth, p256dh } = sub;
      const pushConfig = {
        endpoint,
        keys: {
          auth,
          p256dh
        }
      };

      webpush
        .sendNotification(
          pushConfig,
          JSON.stringify({
            title: 'New Topic',
            content: topic,
            openUrl: `/topic/${newTopic.id}`
          })
        )
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.readTopics = async (ctx) => {
  const { authorization: token } = ctx.headers;
  const isAuthenticated = await authAdmin(ctx, token);
  if (!isAuthenticated) {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized'
    };
    return;
  }

  // const { season } = ctx.query;
  try {
    const topics = await Topic.findAll({
      raw: true
    });
    ctx.body = topics;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.readSeasonTopics = async (ctx) => {
  const { authorization: token } = ctx.headers;
  const isAuthenticated = await authAdmin(ctx, token);
  if (!isAuthenticated) {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized'
    };
    return;
  }

  const { season } = ctx.params;
  try {
    const topics = await Topic.findAll({
      season,
      raw: true
    });
    ctx.body = topics;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.readTopic = async (ctx) => {
  const { authorization: token } = ctx.headers;
  const isAuthenticated = await authAdmin(ctx, token);
  if (!isAuthenticated) {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized'
    };
    return;
  }
  const { id } = ctx.params;

  try {
    const topic = await Topic.findOne({ where: { id } });
    ctx.body = topic;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.update = async (ctx) => {
  const { authorization: token } = ctx.headers;
  const isAuthenticated = await authAdmin(ctx, token);
  if (!isAuthenticated) {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized'
    };
    return;
  }

  const { id } = ctx.params;
  const {
    topic, day, season, desc
  } = ctx.request.body;
  try {
    const result = await Topic.update(
      {
        topic,
        day,
        season,
        desc
      },
      { where: { id } }
    );
    ctx.body = result;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.remove = async (ctx) => {
  const { authorization: token } = ctx.headers;
  const isAuthenticated = await authAdmin(ctx, token);
  if (!isAuthenticated) {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized'
    };
    return;
  }

  const { id } = ctx.params;
  try {
    await Topic.destroy({
      where: { id }
    });
    ctx.status = 204;
  } catch (e) {
    ctx.throw(e, 500);
  }
};
