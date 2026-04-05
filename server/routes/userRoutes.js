const express = require('express');
const {
  getPublicProfile,
  updateProfile,
  changePassword,
  updatePayout,
} = require('../controllers/userController');
const { protect, isSeller } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/profile/:id', getPublicProfile);
router.put('/profile', protect, uploadAvatar, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/payout', protect, isSeller, updatePayout);

module.exports = router;
