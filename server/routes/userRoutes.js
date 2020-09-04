const express = require('express');
const router = express.Router();

//import controllers
const { userSignup, accountActivation, userSignin, forgotPassword, resetPassword } = require('../controllers/userController');

//import validator
const { userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validator/User');
const { runValidation } = require('../validator/index');

router.post('/userSignup', userSignupValidator, runValidation, userSignup);
router.post('/account-activation', accountActivation);
router.post('/userSignin', userSigninValidator, runValidation, userSignin);
//forgot reset password
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);


module.exports = router;