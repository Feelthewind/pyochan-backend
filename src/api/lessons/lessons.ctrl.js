const { Lesson, User } = require('models');

exports.list = async (ctx) => {
  console.log(ctx.query);
  const { topicId, isReview } = ctx.query;

  const review = isReview ? 1 : 0;
  try {
    const lessons = await Lesson.findAll({
      where: { topicId, isReview: review },
      raw: true
    });

    if (!ctx.user) {
      ctx.body = lessons;
      return;
    }

    const { id: userId } = ctx.user;

    const user = await User.findOne({ where: { id: userId } });
    const likeLessons = await user.getLessons({ raw: true });
    const topics = await user.getTopics({ raw: true });

    let exists = null;

    topics.forEach((topic) => {
      const temp = topic.id === parseInt(topicId, 10);
      exists = temp || exists;
    });
    if (!exists) {
      await user.addTopic(topicId);
    }

    const result = [];

    for (let i = 0; i < lessons.length; i++) {
      let isPushed = false;
      for (let j = 0; j < likeLessons.length; j++) {
        if (likeLessons[j].id === lessons[i].id) {
          isPushed = true;
          result.push({ ...lessons[i], liked: true });
        }
      }
      if (!isPushed) {
        result.push({ ...lessons[i], liked: false });
      }
    }

    ctx.body = result;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.likeLesson = async (ctx) => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;

  try {
    const lesson = await Lesson.find({ where: { id } });
    await lesson.addUser(userId);

    ctx.body = {
      liked: true,
      lessonId: id
    };
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      lessonId: id
    };
  }
};

exports.unlikeLesson = async (ctx) => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;
  try {
    const lesson = await Lesson.find({ where: { id } });
    await lesson.removeUser(userId);
    ctx.body = {
      liked: false,
      lessonId: id
    };
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      lessonId: id
    };
  }
};

exports.check = async (ctx) => {
  const { id: userId } = ctx.user;
  const user = await User.findOne({ where: { id: userId } });
  const checks = await user.getLessons({ raw: true });

  const result = checks.map(check => ({
    ...check,
    liked: true
  }));

  ctx.body = {
    reviews: result
  };
};

// exports.review = async (ctx) => {
//   const lessons = await Lesson.findAll({ where: { isReview: true } });

//   ctx.body = {
//     lessons
//   };
// };
