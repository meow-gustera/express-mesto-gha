const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorStatusBadRequest = require('../utilits/errorStatusBadRequest');
const ErrorStatusNotFound = require('../utilits/errorStatusNotFound');
const ErrorStatusConflict = require('../utilits/errorStatusConflict');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
      })
        .send({ message: 'Вы авторизовались' })
        .end();
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new ErrorStatusNotFound('Необходима авторизация');
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new ErrorStatusNotFound('Пользователь по указанному _id не найден.');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorStatusBadRequest('Передан некорректный формат _id.'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorStatusBadRequest('Переданы некорректные данные при создании юзера.'));
      } else if (err.code === 11000) {
        next(new ErrorStatusConflict('Такой email уже используется'));
      } else {
        next(err);
      }
    });
};

module.exports.changeProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      // runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrorStatusNotFound('Переданы некорректные данные при обновлении пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrorStatusNotFound('Переданы некорректные данные при обновлении пользователя.'));
      } else {
        next(err);
      }
    });
};
