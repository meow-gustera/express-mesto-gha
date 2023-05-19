const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const cardValidation = require('../middlewares/validation')

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', cardValidation, deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
