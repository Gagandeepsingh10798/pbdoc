const Models = require("../../data-models");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const LogsDataManagement = function () {
  const LogsModel = Models.logs;

  this.getLogs = async () => {
    try {
      let logs = await LogsModel.find({}, PROJECTIONS.createLogs).lean();
      return logs;
    } catch (err) {
      throw err;
    }
  };

  this.getLogById= async (logId) => {
    try {
      logId = ObjectId(logId);
      let logsExists = await LogsModel.findOne({ _id: logId },PROJECTIONS.createLogs).lean();
      if (!logsExists){
        throw new Error(MESSAGES.admin.LOGS_WITH_ID_NOT_EXIST);
      }  
      return logsExists;
    } catch (err) {
      throw err;
    }
  };

};
module.exports = LogsDataManagement;