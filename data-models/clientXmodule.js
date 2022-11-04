const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const ClientXModuleModel = new Schema({
    clientId: {
        type: ObjectId,
        ref: 'client',
    },
    moduleId: {
        type: ObjectId,
        ref: 'module'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

});
const ClientXModule =mongoose.model('ClientXModule',ClientXModuleModel);
module.exports = ClientXModule;
