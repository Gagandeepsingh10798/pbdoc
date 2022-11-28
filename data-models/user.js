const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const USER_TYPES = Object.values(config.get('USER_TYPES'));

const UserModel = new Schema({
    userName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    countryCode: {
        type: String,
        trim: true,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: USER_TYPES
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const User = mongoose.model('User', UserModel);
User.createIndexes({ userName: 1, email: 1, phone: 1, countryCode: 1 });
module.exports = User;