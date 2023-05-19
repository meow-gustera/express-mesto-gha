/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().min(2).require(/^((http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/m),
  }),
});

module.exports = cardValidation;
