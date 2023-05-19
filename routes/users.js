const router = require('express').Router();
const {
  getUsers,
  getUserId,
  changeProfile,
  changeAvatar,
  getUserMe,
} = require('../controllers/users');
const userValidation = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', getUserId);
router.patch('/me', userValidation, changeProfile);
router.patch('/me/avatar', userValidation, changeAvatar);

module.exports = router;
