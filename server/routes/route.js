const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, sendVerificationCode, resetPassword} = require('../controller/controllers');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/send-verification', sendVerificationCode);
router.post("/forgorPassword",forgotPassword);
router.post("/reset-password",resetPassword);
//router.post('/verify-code',verifyCode)
module.exports = router;
