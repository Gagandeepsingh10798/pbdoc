const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ClientModel = new Schema({
    name: {
        type: String,
        default: "",
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: ''
    },
    domain: {
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
    address: {
        type: String,
        default: ''
    },
    lat:{
        type: String,
        default: ''
    },
    lng:{
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCKED'],
        default: 'ACTIVE'
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
const Client = mongoose.model('Client', ClientModel);
Client.createIndexes({email: 1, phone: 1, countryCode: 1});
module.exports = Client;