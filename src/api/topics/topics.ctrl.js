const { Topic, User } = require('models');

exports.read = async (ctx) => {
  const { season } = ctx.query;
  try {
    const topics = await Topic.findAll({
      where: { season },
      raw: true
    });
    if (!ctx.user) {
      ctx.body = topics;
      return;
    }

    const { id: userId } = ctx.user;
    const user = await User.findOne({ where: { id: userId } });

    const topicsRead = await user.getTopics({ raw: true });
    const topicsComplete = await user.getCtopics({ raw: true });

    const result = [];

    for (let i = 0; i < topics.length; i++) {
      let isPushed = false;
      for (let j = 0; j < topicsRead.length; j++) {
        if (topicsRead[j].id === topics[i].id) {
          isPushed = true;
          result.push({ ...topics[i], read: true });
        }
      }
      if (!isPushed) {
        result.push({ ...topics[i], read: false });
      }
    }

    const finalResult = [];

    for (let i = 0; i < result.length; i++) {
      let isPushed = false;
      for (let j = 0; j < topicsComplete.length; j++) {
        if (topicsComplete[j].id === result[i].id) {
          isPushed = true;
          finalResult.push({ ...result[i], complete: true });
        }
      }
      if (!isPushed) {
        finalResult.push({ ...result[i], complete: false });
      }
    }

    ctx.body = finalResult;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.finish = async (ctx) => {
  const { id } = ctx.params;
  const { id: userId } = ctx.user;
  try {
    const user = await User.findOne({ where: { id: userId } });
    const Ctopics = await user.getCtopics({ raw: true });
    for (let i = 0; i < Ctopics.length; i++) {
      if (Ctopics[i].id === parseInt(id, 10)) {
        ctx.status = 400;
        ctx.body = {
          message: 'ALREADY_COMPLETE'
        };
        return;
      }
    }
    await user.addCtopic(id);
    ctx.body = {
      message: 'success',
      topicId: id
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};
