const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ApiPermissionModel = new Schema({
    userType: {
        type: String,
        enum: ['ADMIN', 'CLIENT','SUB_ADMIN','DEVELOPER','TESTER']
    },
    permissions: [{
        type: String,
        default: ''
    }]

});
const ApiPermission = mongoose.model('Apipermissions', ApiPermissionModel);
module.exports = ApiPermission;