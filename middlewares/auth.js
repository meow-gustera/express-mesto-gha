const jwt = require('jsonwebtoken');
const ErrorStatusUnauthorized = require('../utilits/errorStatusUnauthorized');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new ErrorStatusUnauthorized('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    next(new ErrorStatusUnauthorized('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
