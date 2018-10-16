const { User } = require('models');
const Joi = require('joi');
const { generate } = require('src/lib/token');
const bcrypt = require('bcrypt');

exports.localLogin = async (ctx) => {
  try {
    const { email, password } = ctx.request.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      ctx.status = 409;
      ctx.body = {
        name: 'EMAIL_NOT_EXIST'
      };
      return;
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      ctx.status = 409;
      ctx.body = {
        name: 'PASSWORD_NO_MATCH'
      };
      return;
    }

    const token = await generate({ user: { id: user.id } });

    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: process.env.NODE_ENV === 'development' ? 'localhost' : '.pyochan.com'
    });

    ctx.body = {
      user: {
        id: user.id,
        isSubscribe: user.isSubscribe
      }
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

exports.createLocalAccount = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .required(),
    password: Joi.string().required()
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_SCHEMA',
      payload: result.error
    };
    return;
  }

  const { email, password } = ctx.request.body;

  try {
    const emailExists = await User.findOne({ where: { email } });

    if (emailExists) {
      ctx.status = 409;
      ctx.body = {
        name: 'DUPLICATED_ACCOUNT'
      };
      return;
    }
  } catch (e) {
    ctx.throw(e, 500);
  }

  try {
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hash });
    const { id, isSubscribe } = user;

    const token = await generate({ user: { id: user.id } });

    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: process.env.NODE_ENV === 'development' ? 'localhost' : '.pyochan.com'
    });

    ctx.body = {
      user: {
        id,
        isSubscribe
      }
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

exports.check = async (ctx) => {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }

  try {
    const now = new Date();
    const user = await User.findOne({ where: { id: ctx.user.id } });
    if (!user) {
      ctx.cookies.set('access_token', null, {
        domain: process.env.NODE_ENV === 'development' ? 'localhost' : '.pyochan.com'
      });
      ctx.status = 401;
      return;
    }

    if (ctx.tokenExpire - now < 1000 * 60 * 60 * 24 * 4) {
      try {
        const token = await generate({ user: { id: user.id } });
        ctx.cookies.set('access_token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          domain: process.env.NODE_ENV === 'development' ? 'localhost' : '.pyochan.com'
        });
      } catch (e) {
        ctx.throw(500, e);
      }
    }

    ctx.body = {
      user: {
        id: user.id,
        isSubscribe: user.isSubscribe
      }
    };
  } catch (e) {
    console.log(e);
  }
};

exports.logout = (ctx) => {
  ctx.cookies.set('access_token', null, {
    domain: process.env.NODE_ENV === 'development' ? 'localhost' : '.pyochan.com'
  });
  ctx.status = 204;
};
