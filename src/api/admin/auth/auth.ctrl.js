const { generate } = require('src/lib/token');

exports.adminLogin = async (ctx) => {
  const { password } = ctx.request.body;

  try {
    if (password !== process.env.ADMIN_PASSWORD) {
      ctx.status = 409;
      ctx.body = {
        name: 'PASSWORD_NOT_MATCH'
      };
    }

    const token = await generate({ user: { id: process.env.ADMIN_ID } });

    ctx.body = {
      token
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};
