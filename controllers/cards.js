const Card = require('../models/card');

// post
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные при создании карточки.');
      } else {
        res.status(500).send(`Ошибка по умолчанию. ${err.name}`);
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send(`Ошибка по умолчанию. ${err.message}`));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null) {
        res.status(404).send('Карточка по указанному _id не найден.');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Передан некорректный формат _id карточки.');
      } else {
        res.status(500).send(`Ошибка по умолчанию. ${err.message}`);
      }
    });
};

// put
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(404).send('Передан несуществующий _id карточки.');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Переданы некорректные данные для постановки лайка.');
      } else {
        res.status(500).send(`Ошибка по умолчанию. ${err.message}`);
      }
    });
};

// delete
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(404).send('Передан несуществующий _id карточки.');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Переданы некорректные данные для снятия лайка.');
      } else {
        res.status(500).send(`Ошибка по умолчанию. ${err.message}`);
      }
    });
};
