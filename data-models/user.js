const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = new Schema({
    profilePic: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        default: "",
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        default: "",
        lowercase: true,
        trim: true
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
    address: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['ADMIN','CLIENT']
    },
    deviceType: {
        type: String,
        enum: ['IOS', 'ANDROID', 'WEB']
    },
    deviceToken: {
        type: String,
        default: ''
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
User.createIndexes({email: 1, phone: 1, countryCode: 1});
module.exports = User;