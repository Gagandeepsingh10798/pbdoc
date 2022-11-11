const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ApiPermissionModel = new Schema({
    userType: {
        type: String,
        enum: ['ADMIN', 'CLIENT']
    },
    permissions: [{
        type: String,
        default: ''
    }]

});
const admin =["/api/v1/admin/signup","/api/v1/admin/login","/api/v1/admin/profile","/api/v1/admin/change/password","/api/v1/admin/forgot/password","/api/v1/admin/reset/password","/api/v1/admin/logout"];
const client = ["/client","/client/:id"];
const ApiPermission = mongoose.model('Apipermissions', ApiPermissionModel);

var m = new ApiPermission;
m.userType = "ADMIN";
m.permissions = admin;
m.save(()=>{
    console.log("saved");
})
var n = new ApiPermission;
n.userType = "CLIENT";
n.permissions = client;
n.save(()=>{
    console.log("saved");
})

module.exports = ApiPermission;