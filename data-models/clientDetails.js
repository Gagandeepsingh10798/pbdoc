const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const ClientDetailsModel = new Schema({
    name: {
        type: String,
        default: ''
    },
    userId: {
        type: ObjectId,
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
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const ClientDetails = mongoose.model('ClientDetails', ClientDetailsModel);
ClientDetails.createIndexes({ clientId: 1 });
module.exports = ClientDetails;