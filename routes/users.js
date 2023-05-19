const router = require('express').Router();
const {
  getUsers,
  getUserId,
  changeProfile,
  changeAvatar,
  getUserMe,
} = require('../controllers/users');
const { userValidationProfile, userValidationAvatar, userIdValidation } = require('../middlewares/userValidation');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', userIdValidation, getUserId);
router.patch('/me', userValidationProfile, changeProfile);
router.patch('/me/avatar', userValidationAvatar, changeAvatar);

module.exports = router;
