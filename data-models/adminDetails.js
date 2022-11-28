const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const config = require('config');
const DEVICE_TYPES = Object.values(config.get('DEVICE_TYPES'));

const AdminDetailsModel = new Schema({
    profilePic: {
        type: String,
        default: ''
    },
    userId: {
        type: ObjectId,
        ref: 'users'
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
    address: {
        type: String,
        default: ''
    },
    lat: {
        type: String,
        default: ''
    },
    lng: {
        type: String,
        default: ''
    },
    deviceType: {
        type: String,
        enum: DEVICE_TYPES
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
const AdminDetails = mongoose.model('AdminDetails', AdminDetailsModel);
AdminDetails.createIndexes({ userId: 1 });
module.exports = AdminDetails;