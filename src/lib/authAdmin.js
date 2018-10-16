const { decode } = require('src/lib/token');

exports.authAdmin = async (ctx, token) => {
  if (!token) {
    return false;
  }

  try {
    const decoded = await decode(token);
    const { user, exp } = decoded;

    if (user.id !== process.env.ADMIN_ID) {
      // ctx.status = 401;
      // ctx.body = {
      //   error: 'Unauthorized'
      // };
      return false;
    }

    return true;
  } catch (e) {
    // ctx.user = null;
    // ctx.status = 401;
    // ctx.body = {
    //   error: 'JWT_MALFORMED'
    // };
    return false;
  }
};
