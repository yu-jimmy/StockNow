const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    symbols: [{
        type: String
    }],
    twoFactor: {
        type: Boolean
    },
    twoFactorSecret: {
        type: String
    },
    twoFactorSecretAscii: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);