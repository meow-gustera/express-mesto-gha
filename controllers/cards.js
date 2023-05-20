const Card = require('../models/card');
const ErrorStatusBadRequest = require('../utilits/errorStatusBadRequest');
const ErrorStatusNotFound = require('../utilits/errorStatusNotFound');
const ErrorStatusForbidden = require('../utilits/errorStatusForbidden');

// post
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorStatusBadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card === null) {
        throw new ErrorStatusNotFound('Карточка по указанному _id не найден.');
      } else if (card.owner._id.toString() === req.user._id) {
        return Card.findByIdAndRemove(cardId)
          .then(() => res.send({ message: `Удалена карточка: ${card}` }));
      } else {
        throw new ErrorStatusForbidden('Удалить карточку может только её владелец.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorStatusBadRequest('Передан некорректный формат _id карточки.'));
      } else {
        next(err);
      }
    });
};

// put
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new ErrorStatusNotFound('Передан несуществующий _id карточки.');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorStatusBadRequest('Переданы некорректные данные для постановки лайка.'));
      } else {
        next(err);
      }
    });
};

// delete
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new ErrorStatusNotFound('Передан несуществующий _id карточки.');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorStatusBadRequest('Переданы некорректные данные для снятия лайка.'));
      } else {
        next(err);
      }
    });
};
