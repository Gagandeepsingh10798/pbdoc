const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const AuthTokenModel = new Schema({
    token: {
        type: String,
        default: ''
    },
    refreshToken: {
        type: String,
        default: ''
    },
    user: {
        type: ObjectId,
        ref: 'users',
        required: true
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const AuthToken = mongoose.model('AuthToken', AuthTokenModel);
AuthToken.createIndexes({ token: 1, refreshToken: 1, user: 1 });
module.exports = AuthToken;