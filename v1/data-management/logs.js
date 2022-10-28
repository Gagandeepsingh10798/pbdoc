const Models = require("../../data-models");
const validations = require("./validations");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const universal = require("../../utils");
const config = require("config");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const LogsDataManagement = function () {


    const LogsModel = Models.logs;
    
    this.getlogs  = async () => {
        try {
          
              let logs = await LogsModel.find({},PROJECTIONS.createClient).lean();
          return logs;
          
         
        } catch (err) {
          throw err;
        }
      };

      this.deletelogs = async () => {
        try {
         let logs=   await LogsModel.deleteMany({ });
         

          return logs;
        } catch (err) {
          throw err;
        }
      };



};
module.exports = LogsDataManagement;