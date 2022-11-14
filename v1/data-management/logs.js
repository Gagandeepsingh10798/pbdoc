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

  this.getlogs = async () => {
    try {

      let logs = await LogsModel.find({}, PROJECTIONS.createLogs).lean();
      return logs;


    } catch (err) {
      throw err;
    }
  };

  this.deletelogs = async () => {
    try {
      let logs = await LogsModel.deleteMany({});


      return logs;
    } catch (err) {
      throw err;
    }
  };

  this.clearLogs = async () => {
    try {
      await LogsModel.deleteMany({}); 
      return;
    } catch (err) {
      throw err;
    }

  };

  this.deletelogsId = async (findId) => {
    try {
      const _id = findId;
      await LogsModel.findOneAndDelete({ _id: ObjectId(_id) });
    let deleted = await LogsModel.findOne(
        { _id: ObjectId(_id) }
      ).lean();
      return deleted;
    } catch (err) {
      throw err;
    }
  };

  this.getSingleLog= async (logsId) => {
    try {
      const _id=logsId;
      let logsExists = await LogsModel.findById({ _id },PROJECTIONS.createLogs).lean();
      if (logsExists) {
        return logsExists;
      } else {
        throw new Error(MESSAGES.admin.LOGS_WITH_ID_NOT_EXIST);
      }
    } catch (err) {
      throw err;
    }
  };



};
module.exports = LogsDataManagement;