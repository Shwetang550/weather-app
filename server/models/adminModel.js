const mongoose = require('mongoose');
const crypto = require('crypto');

//user schema
const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            max: 32,
            min: 4
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        hashed_password: {
            type: String,
            required: true,
            trim: true,
            max: 32,
        },
        salt: String,
        role: {
            type: String,
            default: 'Admin'
        },
        resetPassword: {
            data: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
)

//virtual field
adminSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password;
})

//methods
adminSchema.methods = {

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function(password) {
        if (!password) return ''
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
        } 
        catch(err) {
            return ''
        }
    },

    makeSalt: function() {
        return Math.random(new Date().valueOf() * Math.random()) + ''
    }
};


module.exports = mongoose.model('Admin', adminSchema);