const { Subscription, User } = require('models');

exports.register = async (ctx) => {
  const {
    endpoint,
    keys: { auth, p256dh }
  } = ctx.request.body;
  console.dir('ctx.request.body', ctx.request.body);
  const { id: userId } = ctx.user;

  try {
    const subs = await Subscription.create({
      endpoint,
      auth,
      p256dh
    });

    await User.update(
      {
        isSubscribe: true
      },
      {
        where: { id: userId }
      }
    );

    ctx.body = subs;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

// exports.review = async (ctx) => {
//   const lessons = await Lesson.findAll({ where: { isReview: true } });

//   ctx.body = {
//     lessons
//   };
// };
