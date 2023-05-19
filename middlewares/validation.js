const { celebrate, Joi } = require('celebrate');

const userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().min(2).regex(/^((http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/m),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// const validCardId = celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().required().length(24),
//   }),
// });

module.exports = userValidation;
// module.exports = validCardId;
