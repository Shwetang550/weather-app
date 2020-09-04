const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const _ = require('lodash');
//sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


exports.adminSignup = (req, res) => {
    //console.log(req.body);
    const {name, email, password} = req.body

    Admin.findOne({email}).exec((err, admin) => {
        if(admin) {
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

            const admin = new Admin({name, email, password})

            admin.save((err, admin) => {
                if(err) {
                    console.log('SAVE ADMIN IN ACCOUNT ACTIVATION ERROR', err)
                    return res.status(401).json({
                        error: 'Error saving admin in database. Try signup again'
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


exports.adminSignin = (req, res) => {
    const {email, password} = req.body
    //check if admin exist
    Admin.findOne({email}).exec((err, admin) => {
        if(err || !admin) {
            return res.status(400).json({
                error: 'Admin with that email does not exist. Please signup'
            })
        }
        //authenticate
        if(!admin.authenticate(password)) {
            return res.status(400).json({
                eerror: 'Email and password do not match.'
            })
        }
        //generate a token and send to client
        const token = jwt.sign({_id: admin._id}, process.env.JWt_SECRET, {expiresIn: '7d'});
        const {_id, name, email, role} = admin

        return res.json({
            token,
            admin: {_id, name, email, role}
        });
    });
};


exports.forgotPassword = (req, res) => {
    const {email} = req.body;

    Admin.findOne({email}, (err, admin) => {
        if(err || !admin) {
            return res.status(400).json({
                error: 'Admin with that email does not exist.'
            });
        }

        const token = jwt.sign({_id: admin._id}, process.env.JWT_RESET_PASSWORD, {expiresIn: '15m'})

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

        return admin.updateOne({resetPassword: token}, (err, success) => {
            if(err) {
                console.log('RESET PASSWORD ERROR', err);
                return res.status(400).json({
                    error: 'Database connection error on admin password forgot request.'
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

            Admin.findOne({resetPassword}, (err, admin) => {
                if(err || !admin) {
                    return res.status(400).json({
                        error: 'Something went wrong. Try again!'
                    }); 
                } 

                const updatedFields = {
                    password: newPassword,
                    resetPassword: ''
                }

                admin = _.extend(admin, updatedFields)

                admin.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: 'Error updating admin password.'
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