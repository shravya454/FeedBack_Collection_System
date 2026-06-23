const express = require('express');

const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyOTP,
    testMail,
    resendOTP,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/test-mail', testMail);
module.exports = router;
