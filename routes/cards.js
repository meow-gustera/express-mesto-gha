const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardValidation, idValidation } = require('../middlewares/cardValidation');

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', idValidation, deleteCard);
router.put('/:cardId/likes', idValidation, likeCard);
router.delete('/:cardId/likes', idValidation, dislikeCard);

module.exports = router;
