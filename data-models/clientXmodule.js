const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const ClientXModuleModel = new Schema({
    clientId: {
        type: ObjectId,
        ref: 'Client',
    },
    moduleId: {
        type: ObjectId,
        ref: 'Modules'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

},{
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const ClientXModule = mongoose.model('ClientXModule', ClientXModuleModel);
module.exports = ClientXModule;
