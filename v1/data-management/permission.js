const Models = require("../../data-models");
const validations = require("./validations");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const universal = require("../../utils");
const config = require("config");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const { all } = require("../routes/admin");
const permissionDataManagement = function () {
    const permissions = Models.Apipermission;
    const Apis = Models.Apis;
    this.getAllApi = async (clientid,modulearray) => {
        try {
          // let clientmodule = await new ClientXModuleModel(modulearray).save();
          // clientmodule = await ClientXModuleModel.findOne({ _id: clientmodule._id },PROJECTIONS.createModule).lean();
          let allApi = await Apis.find({}).lean();
    
          return allApi;
        } catch (err) {
          throw err;
        }
      };
      this.addPermission  = async (credentials) => {
        try {
              var myquery = { userType: credentials.type };
           const appmodel= await permissions.findOne({ userType: credentials.type }).lean();
           const permissionArray = appmodel.permissions;
           credentials.permissions.forEach(x=>{
            permissionArray.push(x);
           })
           var newvalues = { $set: { permissions: permissionArray} };
            const updated=  await permissions.updateOne(myquery, newvalues).clone().catch(function(err){ console.log(err)})
            let apiPermission =  await permissions.find({userType:credentials.type}).lean();
            console.log(apiPermission);
          return apiPermission;
        } catch (err) {
          throw err;
        }
      };
      this.getPermissionsByUserType = async(credentials)=>{
       try {
        const allPermissions = await permissions.findOne({ userType: credentials.type }).lean();
         return allPermissions;
       } catch (error) {
        throw error;
       }
        
      }



};
module.exports = permissionDataManagement;
