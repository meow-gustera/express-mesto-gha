/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/^((http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/m),
  }),
});

const idValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
});

module.exports = { cardValidation, idValidation };
