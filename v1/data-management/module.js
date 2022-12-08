const Models = require("../../data-models");
const validations = require("./validations");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const universal = require("../../utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const ModuleDataManagement = function () {
  const ModuleModel = Models.modules;
  const VisModel = Models.vis;


  this.createModule = async (businessDocument, moduleData) => {
    let businessDocumentUploaded = false;
    try {
      await validations.validateCreateModule(moduleData);
      const { title } = moduleData;

      let moduleExists = await ModuleModel.findOne({ title, isDeleted: false }).lean();
      if (moduleExists) {
        throw new Error(MESSAGES.admin.TITLE_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT);
      }

      if (businessDocument) {
        moduleData.businessDocument = await universal.uploadFile(businessDocument);
        businessDocumentUploaded = true;
      }

      let modulePayload = await new ModuleModel(moduleData).save();
      modulePayload = await ModuleModel.findOne({ _id: modulePayload._id }, PROJECTIONS.createModule).lean();
      if (!moduleData.visFlow) {
        moduleData.visFlow = {
          moduleId: modulePayload._id,
          nodes: [],
          edges: []
        };
      }
      moduleData.visFlow.moduleId = modulePayload._id;
      let moduleVisFlow = await new VisModel(moduleData.visFlow).save();
      modulePayload.visFlow = moduleVisFlow;
      return modulePayload;
    } catch (err) {
      if (businessDocumentUploaded && moduleData.businessDocument) {
        await universal.deleteFile(moduleData.businessDocument);
      }
      throw err;
    }
  };

  this.getModule = async () => {
    try {

      let module = await VisModel.aggregate([
        {
          $match: {
            isDeleted: false
          }
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
          $project: {
            "_id": "$moduleId._id",
            "title": "$moduleId.title",
            "description": "$moduleId.description",
            "heading": "$moduleId.heading",
            "subHeading": "$moduleId.subHeading",
            "figmaLink": "$moduleId.figmaLink",
            "businessDocument": "$moduleId.businessDocument",
            "bfDiagram": "$moduleId.bfDiagram",
            "visFlow": {
              "nodes": "$nodes",
              "edges": "$edges",
            }
          }
        }
      ]);
      return module;

    } catch (err) {
      throw err;
    }
  };

  this.getModuleById = async (moduleId) => {
    try {
      moduleId = ObjectId(moduleId);
      let moduleExists = await ModuleModel.findOne({ _id: moduleId }).lean();
      if (moduleExists) {
        let modulePayload = await ModuleModel.findOne({ _id: moduleId }, PROJECTIONS.createModule).lean();
        let moduleVisFlow = await VisModel.findOne({ moduleId }, PROJECTIONS.createVis).lean();
        modulePayload.visFlow = moduleVisFlow;
        return modulePayload;
      } else {
        throw new Error(MESSAGES.admin.MODULE_WITH_ID_NOT_EXIST);
      }
    } catch (err) {
      throw err;
    }
  };

  this.updateModuleById = async (findId, moduleData) => {
    try {

      await validations.validateUpdateModule(moduleData);
      let module = await this.checkModuleExists(findId);
      await ModuleModel.findOneAndUpdate({ _id: ObjectId(module._id) },moduleData);
      if(moduleData.visFlow){
        await VisModel.findOneAndUpdate({ moduleId: module._id }, moduleData.visFlow);
      }
      module = await this.getModuleById(module._id);
      return module;
    } catch (err) {
      throw err;
    }

  };



  this.checkModuleExists = async (findId) => {
    try {
      let isExists = false;

      const _id = findId;

      if (_id) {
        isExists = await ModuleModel.findOne(
          { _id: ObjectId(_id), isDeleted: false }
        ).lean();
      }
      if (!isExists) throw new Error(MESSAGES.admin.MODULE_WITH_ID_NOT_EXIST);

      return isExists;
    } catch (err) {
      throw err;
    }
  };

  this.deleteModulebyid = async (findId) => {
    try {
      let module = await this.checkModuleExists(findId);
      await ModuleModel.findOneAndDelete({ _id: ObjectId(module._id) });
      module = await ModuleModel.findOne(
        { _id: ObjectId(module._id) }
      ).lean();
      let vis = await VisModel.findOneAndDelete({ moduleId: ObjectId(findId) });
      return module;
    } catch (err) {
      throw err;
    }
  };



};
module.exports = ModuleDataManagement;