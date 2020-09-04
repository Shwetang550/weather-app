const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const _ = require('lodash');
//sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


exports.userSignup = (req, res) => {
    //console.log(req.body);
    const {name, email, password} = req.body

    User.findOne({email}).exec((err, user) => {
        if(user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '15m'})

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Account activation link`,
            html: `
                  <h3>Please use the following link to activate your account</h3>
                  <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                  <hr/>
                  <p>This email may contain sensetive information</p>
                  <p>${process.env.CLIENT_URL}</p>
            `
        }

        sgMail
            .send(emailData)
            .then(sent => {
                 //console.log('SIGNUP EMAIL SENT', sent)
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                });
            })
            .catch(err => {
                 //console.log('SIGNUP EMAIL SENT ERROR', err)
                return res.status(404).json({
                    message: err.message
                });
            });
    });
};


exports.accountActivation = (req, res) => {
    const {token} = req.body

    if(token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if(err) {
                console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err)
                return res.status(401).json({
                    error: 'Expired link. Signup again'
                })
            }
            
            const {name, email, password} = jwt.decode(token)

            const user = new User({name, email, password})

            user.save((err, user) => {
                if(err) {
                    console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err)
                    return res.status(401).json({
                        error: 'Error saving user in database. Try signup again'
                    });
                }
                return res.json({
                    message: 'Signup success. Please signin'
                });
            });
        });
    } else {
        return res.json({
            message: 'Something went wrong. Try again'
        })
    }
};


exports.userSignin = (req, res) => {
    const {email, password} = req.body
    //check if user exist
    User.findOne({email}).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            })
        }
        //authenticate
        if(!user.authenticate(password)) {
            return res.status(400).json({
                eerror: 'Email and password do not match.'
            })
        }
        //generate a token and send to client
        const token = jwt.sign({_id: user._id}, process.env.JWt_SECRET, {expiresIn: '7d'});
        const {_id, name, email, role} = user

        return res.json({
            token,
            user: {_id, name, email, role}
        });
    });
};


exports.forgotPassword = (req, res) => {
    const {email} = req.body;

    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist.'
            });
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_RESET_PASSWORD, {expiresIn: '15m'})

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password reset link`,
            html: `
                  <h3>Please use the following link to reset your password.</h3>
                  <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                  <hr/>
                  <p>This email may contain sensetive information</p>
                  <p>${process.env.CLIENT_URL}</p>
            `
        };

        return user.updateOne({resetPassword: token}, (err, success) => {
            if(err) {
                console.log('RESET PASSWORD ERROR', err);
                return res.status(400).json({
                    error: 'Database connection error on user password forgot request.'
                });
            } else {
                sgMail
                .send(emailData)
                .then(sent => {
                     //console.log('SIGNUP EMAIL SENT', sent)
                    return res.status(200).json({
                        message: `Email has been sent to ${email}. Follow the instruction to reset your password`
                    });
                })
                .catch(err => {
                     //console.log('SIGNUP EMAIL SENT ERROR', err)
                    return res.status(404).json({
                        message: err.message
                    });
                });
            }
        })
    })
};


exports.resetPassword = (req, res) => {
    const {resetPassword, newPassword} = req.body;

    if(resetPassword) {
        jwt.verify(resetPassword, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if(err) {
                return res.status(400).json({
                    error: 'Expired link. Try again!'
                });
            }

            User.findOne({resetPassword}, (err, user) => {
                if(err || !user) {
                    return res.status(400).json({
                        error: 'Something went wrong. Try again!'
                    }); 
                } 

                const updatedFields = {
                    password: newPassword,
                    resetPassword: ''
                }

                user = _.extend(user, updatedFields)

                user.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: 'Error updating user password.'
                        }); 
                    }
                    res.json({
                        message: `Great! Now you can signin with your new password.`
                    })
                })
            })
        })
    }
};