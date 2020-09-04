const express = require('express');
const router = express.Router();

//import controllers
const { adminSignup, accountActivation, adminSignin, forgotPassword, resetPassword } = require('../controllers/adminController');

//import validator
const { adminSignupValidator, adminSigninValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validator/Admin');
const { runValidation } = require('../validator/index');

router.post('/adminSignup', adminSignupValidator, runValidation, adminSignup);
router.post('/account-activation', accountActivation);
router.post('/adminSignin', adminSigninValidator, runValidation, adminSignin);
//forgot reset password
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);


module.exports = router;