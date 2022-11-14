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
const ClientModel = Models.client;
const ModuleModel = Models.modules;

  this.attachtable = async (Clientid, moduleArray) => {
    try {
      let findId = Clientid.clientid;
      let client = await this.checkClientExists(findId);
      for (let i = 0; i < moduleArray.modules.length; i++) {
        moduleArray.modules[i] = ObjectId(moduleArray.modules[i]);
        let check= await ClientXModuleModel.findOne({clientId:Clientid.clientid,moduleId:moduleArray.modules[i]}).lean();

        if(check==null)
        {
      var clientXmodule = await new ClientXModuleModel({clientId:Clientid.clientid,moduleId:moduleArray.modules[i]}).save();
      }
    }
      let records = await ClientXModuleModel.aggregate([
        {
          $match: {
            clientId: ObjectId(Clientid.clientid),
            moduleId: {$in: moduleArray.modules},
            isDeleted: false
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId"
          }
        },
        {
          $unwind: "$clientId"
        },
        {
          $lookup: {
            from: "modules",
            localField: "moduleId",
            foreignField: "_id",
            as: "moduleId"
          }
        },
        {
          $unwind: "$moduleId"
        },
        {
          $project: { "moduleId": { "isDeleted": 0,"__v":0}, "lastModified" : 0,"clientId":{"isDeleted":0,"createdAt":0,"updatedAt":0,"__v":0},"isDeleted": 0,"__v":0}
        }
        
      ]);

      return records;
    } catch (err) {
      throw err;
    }
  };

  this.getattachtables = async () => {
    try {
      let records = await ClientXModuleModel.aggregate([
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId"
          }
        },
        {
          $unwind: "$clientId"
        },
        {
          $lookup: {
            from: "modules",
            localField: "moduleId",
            foreignField: "_id",
            as: "moduleId"
          }
        },
        {
          $unwind: "$moduleId"
        },
        {
          $project: { "moduleId": { "isDeleted": 0,"__v":0}, "lastModified" : 0,"clientId":{"isDeleted":0,"createdAt":0,"updatedAt":0,"__v":0},"isDeleted": 0,"__v":0}
        }
        
      ]);

      return records;
    } catch (err) {
      throw err;
    }
  };


  this.getattachtable = async (Clientid) => {
    try {
      let findId = Clientid.clientid;
      let client = await this.checkClientExists(findId);
      let records = await ClientXModuleModel.aggregate([
        {
          $match: {
            clientId: ObjectId(Clientid.clientid),
            isDeleted: false
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId"
          }
        },
        {
          $unwind: "$clientId"
        },
        {
          $lookup: {
            from: "modules",
            localField: "moduleId",
            foreignField: "_id",
            as: "moduleId"
          }
        },
        {
          $unwind: "$moduleId"
        },
        {
          $project: { "moduleId": { "isDeleted": 0,"__v":0}, "lastModified" : 0,"clientId":{"isDeleted":0,"createdAt":0,"updatedAt":0,"__v":0},"isDeleted": 0,"__v":0}
        }
        
      ]);

      return records;
    } catch (err) {
      throw err;
    }
  };


  this.checkClientExists = async (findId) => {
    try {
      let isExists = false;

      const _id = findId;

      if (_id) {
        isExists = await ClientModel.findOne({
          _id: ObjectId(_id),
          isDeleted: false,
        }).lean();
      }

      if (!isExists) throw new Error(MESSAGES.admin.CLIENT_WITH_ID_NOT_EXIST);

      return isExists;
    } catch (err) {
      throw err;
    }
  };

  this.getModuleAttach=async (moduleid) => {
    try {
      let moduleExist = await this.checkModuleExists(moduleid);
      let records = await ClientXModuleModel.aggregate([
        {
          $match: {
            moduleId: ObjectId(moduleid),
            isDeleted: false
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId"
          }
        },
        {
          $unwind: "$clientId"
        },
        {
          $lookup: {
            from: "modules",
            localField: "moduleId",
            foreignField: "_id",
            as: "moduleId"
          }
        },
        {
          $unwind: "$moduleId"
        },
        {
          $project: { "moduleId": { "isDeleted": 0,"__v":0}, "lastModified" : 0,"clientId":{"isDeleted":0,"createdAt":0,"updatedAt":0,"__v":0},"isDeleted": 0,"__v":0}
        }
        
      ]);
  
      return records;
    } catch (err) {
      throw err;
    }
  };


};


module.exports = clientXmoduleDataManagement;
