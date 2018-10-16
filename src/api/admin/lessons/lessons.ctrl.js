const { Lesson, User } = require('models');
const Joi = require('joi');
const { authAdmin } = require('src/lib/authAdmin');

const schema = Joi.object().keys({
  jap: Joi.string().required(),
  kor: Joi.string().required(),
  diction: Joi.string().required(),
  isReview: Joi.boolean(),
  topicId: Joi.number() // 프론트에서 string으로 보내도 통과됨.. why?
});

exports.write = async (ctx) => {
  const { authorization: token } = ctx.headers;
  const isAuthenticated = await authAdmin(ctx, token);
  if (!isAuthenticated) {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized'
    };
    return;
  }

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {
    jap, kor, diction, topicId, isReview
  } = ctx.request.body;
  try {
    const lesson = await Lesson.create({
      jap,
      kor,
      diction,
      topicId,
      isReview
    });
    ctx.body = lesson;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.list = async (ctx) => {
  const { authorization: token } = ctx.headers;
  const isAuthenticated = await authAdmin(ctx, token);
  if (!isAuthenticated) {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized'
    };
    return;
  }
  const { topicId, isReview } = ctx.query;

  const review = isReview ? 1 : 0;
  try {
    const lessons = await Lesson.findAll({
      where: { topicId, isReview: review },
      raw: true
    });

    ctx.body = lessons;
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
  const { id } = ctx.params;
  try {
    const lesson = await Lesson.findOne({
      where: { id }
    });
    if (!lesson) {
      ctx.status = 404;
      return;
    }
    ctx.body = lesson;
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
    await Lesson.destroy({
      where: { id }
    });
    ctx.status = 204;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.removeAll = async (ctx) => {
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
    await Lesson.destroy({
      where: { topicId: id }
    });
    ctx.status = 204;
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

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { id } = ctx.params;
  try {
    const lesson = await Lesson.update(ctx.request.body, {
      where: { id }
    }); // postgresql만 업데이트된 로우 데이터가 리턴 됨.
    ctx.body = lesson;
  } catch (e) {
    ctx.throw(e, 500);
  }
};
