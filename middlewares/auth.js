const jwt = require('jsonwebtoken');
const ErrorStatusUnauthorized = require('../utilits/errorStatusUnauthorized');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    throw new ErrorStatusUnauthorized('Необходима авторизация');
  }

  req.user = payload;
  next();
};
