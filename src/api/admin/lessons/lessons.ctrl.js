const { Lesson, User } = require('models');
const Joi = require('joi');
const aws = require('aws-sdk');
const uuid = require('node-uuid');

const { authAdmin } = require('src/lib/authAdmin');
const { generatePollyAudio } = require('src/lib/generatePollyAudio');
const { writeAudioStreamToS3 } = require('src/lib/writeAudioStreamToS3');

new aws.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
const polly = new aws.Polly({
  signatureVersion: 'v4',
  region: 'ap-northeast-1'
});
const s3 = new aws.S3();

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

  const voiceId = 'Seoyeon';
  const filename = `speech-${uuid.v4()}.mp3`;
  const type = 'file';
  let audioUrl = '';
  // const {
  //   voiceId = 'Seoyeon',
  //   text = '스타벅스 허티버터 커피 아이시스 시계',
  //   filename = 'speech.mp3',
  //   type = 'file'
  // } = ctx.query;

  try {
    const audio = await generatePollyAudio(kor, voiceId, polly);

    if (type === 'file') {
      const { url } = await writeAudioStreamToS3(audio.AudioStream, filename, s3);
      const chunks = url.split('://');
      audioUrl = `${chunks[0]}://s3-${chunks[1]}`;
    } else if (type === 'stream') {
      // res.send(audio.AudioStream);
    } else throw { errorCode: 400, error: 'Wrong type for output provided.' };
  } catch (e) {
    console.log(e);
    // if (e.errorCode && e.error) ctx.status(e.errorCode).send(e.error);
    // else ctx.status(500).send(e);
  }

  try {
    const lesson = await Lesson.create({
      jap,
      kor,
      diction,
      topicId,
      isReview,
      audioUrl
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

  // const review = isReview ? 1 : 0;
  try {
    const lessons = await Lesson.findAll({
      where: { topicId },
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
