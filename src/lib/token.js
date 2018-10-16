const jwt = require('jsonwebtoken');

const { SECRET_KEY: secret } = process.env;

exports.generate = (payload, options) => new Promise((resolve, reject) => {
  jwt.sign(
    payload,
    secret,
    {
      issuer: 'api.pyochan.com',
      expiresIn: '7d',
      ...options
    },
    (err, token) => {
      if (err) reject(err);
      resolve(token);
    }
  );
});

exports.decode = token => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (err, decoded) => {
    if (err) reject(err);
    resolve(decoded);
  });
});
