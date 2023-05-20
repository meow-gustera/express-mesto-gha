/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ErrorStatusUnauthorized = require('../utilits/errorStatusUnauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar) => validator.isURL(avatar, { protocols: ['http', 'https', 'ftp'] }),
      message: 'Ссылка некорректная',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    select: false,
    type: String,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorStatusUnauthorized('Нет пользователя');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ErrorStatusUnauthorized('Нет пользователя');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
