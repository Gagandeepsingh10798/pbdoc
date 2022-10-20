const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OtpModel = new Schema({
    code: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    countryCode: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['PASSWORD', 'SIGNUP', 'LOGIN', 'REQUEST']
    },
    expireAt: {
        type: Date,
        default: new Date()
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
OtpModel.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });
const Otp = mongoose.model('Otp', OtpModel);
module.exports = Otp;
