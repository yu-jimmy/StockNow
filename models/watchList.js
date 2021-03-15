const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchListSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    symbols: [{
        type: String,
        required: true
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('WatchList', watchListSchema);