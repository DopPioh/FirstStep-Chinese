const express = require('express');
const { register, login, logout, forgotPassword, resetPassword, verifyOTP ,updateProfile} = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-otp', verifyOTP);
router.put('/update-profile', auth, updateProfile);

module.exports = router;
