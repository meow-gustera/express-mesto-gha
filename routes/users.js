const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserId,
  changeProfile,
  changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', changeProfile);
router.patch('/me/avatar', changeAvatar);

module.exports = router;
