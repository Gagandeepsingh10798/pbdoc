const Models = require("../../data-models");
const validations = require("./validations");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const universal = require("../../utils");
const config = require("config");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const clientXmoduleDataManagement = function () {
  const ClientXModuleModel = Models.clientXmodules;
  const ModuleModel = Models.modules;
  const VisModel = Models.vis;

  this.attachtable = async (Clientid, moduleArray) => {
    try {
      let findId = Clientid.clientid;
      let client = await this.checkClientExists(findId);
      for (let i = 0; i < moduleArray.modules.length; i++) {
        moduleArray.modules[i] = ObjectId(moduleArray.modules[i]);

        let check = await ClientXModuleModel.findOne({
          clientId: Clientid.clientid,
          moduleId: moduleArray.modules[i],
        }).lean();

        if (check == null) {
          var clientXmodule = await new ClientXModuleModel({
            clientId: Clientid.clientid,
            moduleId: moduleArray.modules[i],
          }).save();
        }
      }
      let records = await ClientXModuleModel.aggregate([
        {
          $match: {
            clientId: ObjectId(Clientid.clientid),
            moduleId: { $in: moduleArray.modules },
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId",
          },
        },
        {
          $unwind: "$clientId",
        },
        {
          $lookup: {
            from: "modules",
            localField: "moduleId",
            foreignField: "_id",
            as: "moduleId",
          },
        },
        {
          $unwind: "$moduleId",
        },
        { $group: { _id: "$clientId", modules: { $push: "$moduleId" } } },
        {
          $project: { client: "$_id", modules: "$modules" },
        },
        {
          $project: {
            _id: 0,
            modules: { isDeleted: 0, __v: 0 },
            client: { isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 },
          },
        },
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

  this.getModuleAttach = async (moduleid) => {
    try {
      let moduleExist = await this.checkModuleExists(moduleid);
      let records = await ClientXModuleModel.aggregate([
        {
          $match: {
            moduleId: ObjectId(moduleid),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "modules",
            localField: "moduleId",
            foreignField: "_id",
            as: "moduleId",
          },
        },
        {
          $unwind: "$moduleId",
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId",
          },
        },
        {
          $unwind: "$clientId",
        },
        { $group: { _id: "$moduleId", clients: { $push: "$clientId" } } },
        {
          $project: { module: "$_id", clients: "$clients" },
        },
        {
          $project: {
            _id: 0,
            modules: { isDeleted: 0, __v: 0 },
            clients: { isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 },
          },
        },
      ]);

      return records;
    } catch (err) {
      throw err;
    }
  };
  this.checkModuleExists = async (findId) => {
    try {
      let isExists = false;

      const _id = findId;

      if (_id) {
        isExists = await ModuleModel.findOne({
          _id: ObjectId(_id),
          isDeleted: false,
        }).lean();
      }

      if (!isExists) throw new Error(MESSAGES.admin.MODULE_WITH_ID_NOT_EXIST);

      return isExists;
    } catch (err) {
      throw err;
    }
  };

  this.deletebyclientid = async (clientId, modulesIds) => {
    try {

      await this.checkClientExists(clientId);
      await ClientXModuleModel.deleteMany({ clientId: ObjectId(clientId), moduleId: { $in: modulesIds } });
      return this.getattachtable({ clientid: clientId });
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
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId",
          },
        },
        {
          $unwind: "$clientId",
        },
        {
          $lookup: {
            from: "modules",
            localField: "moduleId",
            foreignField: "_id",
            as: "moduleId",
          },
        },
        {
          $unwind: "$moduleId",
        },
        { $group: { _id: "$clientId", modules: { $push: "$moduleId" } } },
        {
          $project: { client: "$_id", modules: "$modules" },
        },
        {
          $project: {
            _id: 0,
            modules: { isDeleted: 0, __v: 0 },
            client: { isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 },
          },
        },
      ]);

      return records;
    } catch (err) {
      throw err;
    }
  };

  this.attachModules = async (moduleIdsArray, clientId) => {
    try {

      await ClientXModuleModel.deleteMany({
        clientId: ObjectId(clientId)
      });

      moduleIdsArray.forEach(async (moduleId) => {
        await new ClientXModuleModel({
          clientId: ObjectId(clientId),
          moduleId: ObjectId(moduleId)
        }).save();
      });


      let modules = await ModuleModel.find({
        _id: { $in: moduleIdsArray }
      }).lean();

      for(var i=0; i<modules.length; i++){
        modules[i].visFlow = await VisModel.findOne({
          moduleId: modules[i]._id
        }).lean();
      }

      return modules;
    } catch (err) {
      throw err;
    }
  };

  this.getAttachedModules = async (clientId) => {
    try {
      let clientXModules = await ClientXModuleModel.find({
        clientId: ObjectId(clientId)
      });

      let moduleIdsArray = [];
      clientXModules.forEach((item) => {
        moduleIdsArray.push(ObjectId(item.moduleId));
      });


      let modules = await ModuleModel.find({
        _id: { $in: moduleIdsArray }
      }).lean();

      for(var i=0; i<modules.length; i++){
        modules[i].visFlow = await VisModel.findOne({
          moduleId: modules[i]._id
        }).lean();
      }

      return modules;
    } catch (err) {
      throw err;
    }
  };

};

module.exports = clientXmoduleDataManagement;
