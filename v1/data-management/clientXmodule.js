const Models = require("../../data-models");
const validations = require("./validations");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const universal = require("../../utils");
const config = require("config");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const clientXmoduleDataManagement = function () {

    const ClientXModuleModel = Models.clientXmodules;


    this.attachtable = async (clientid,modulearray) => {
        try {
          let clientmodule = await new ClientXModuleModel(modulearray).save();
          clientmodule = await ClientXModuleModel.findOne({ _id: clientmodule._id },PROJECTIONS.createModule).lean();
    
          return clientmodule;
        } catch (err) {
          throw err;
        }
      };
      this.getattachtable  = async () => {
        try {
          
              let commondata = await ClientXModuleModel.find({},PROJECTIONS.createClient).lean();
          return commondata;
          
         
        } catch (err) {
          throw err;
        }
      };



};
module.exports = clientXmoduleDataManagement;
