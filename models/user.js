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
    watchlist: {
        type: Schema.Types.ObjectId,
        ref: 'WatchList'
    }
});

module.exports = mongoose.model('User', userSchema);