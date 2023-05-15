const User = require('../models/user');
const {
  errorStatusBadRequest,
  errorStatusNotFound,
  errorStatusServerError,
} = require('../utilits/error');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(errorStatusServerError).send(`Ошибка по умолчанию. ${err.message}`));
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user === null) {
        res.status(errorStatusNotFound).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorStatusBadRequest).send({ message: 'Передан некорректный формат _id.' });
      } else {
        res.status(errorStatusServerError).send(`Ошибка по умолчанию. ${err.message}`);
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorStatusBadRequest).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(errorStatusServerError).send(`Ошибка по умолчанию. ${err.message}`);
      }
    });
};
module.exports.changeProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user === null) {
        res.status(errorStatusNotFound).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(errorStatusBadRequest).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
      } else {
        res.status(errorStatusServerError).send(`Ошибка по умолчанию. ${err.message}`);
      }
    });
};

module.exports.changeAvatar = (req, res) => {
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
      if (user === null) {
        res.status(errorStatusNotFound).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(errorStatusBadRequest).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
      } else {
        res.status(errorStatusServerError).send(`Ошибка по умолчанию. ${err.message}`);
      }
    });
};
