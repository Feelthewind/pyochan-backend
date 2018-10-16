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
      'BHWsLjFb_kWd97fRDvUbpSFZJl79i88Un_D0v330z4NsdsMKHS7diGzRPajSiY0Z11AK81q_yOyMyLNCOFQ81S8',
      'IHqUvXH8KcCJB1ifxWeSdA54kScAW3X2KBRzQk82g24'
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

exports.read = async (ctx) => {
  const { authorization: token } = ctx.headers;
  const isAuthenticated = await authAdmin(ctx, token);
  if (!isAuthenticated) {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized'
    };
    return;
  }

  const { season } = ctx.query;
  try {
    const topics = await Topic.findAll({
      where: { season },
      raw: true
    });
    ctx.body = topics;
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
