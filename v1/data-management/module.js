const Models = require("../../data-models");
const validations = require("./validations");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const universal = require("../../utils");
const config = require("config");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const timespan = require("jsonwebtoken/lib/timespan");
const ModuleDataManagement = function () {
    const ModuleModel = Models.modules;
    const VisModel=Models.vis;


  this.createModule = async (moduleData) => {
    try {
      console.log(moduleData);
    await validations.validateCreateModule(moduleData);
      const { title, heading, subHeading } = moduleData;

      let moduleExists = await ModuleModel.findOne({
        title,
        isDeleted: false,
      }).lean();
      if (moduleExists) {
        throw new Error(
          MESSAGES.admin.TITLE_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT
        );
      }


      moduleExists = await ModuleModel.findOne({
       heading,
        isDeleted: false,
      }).lean();
      if (moduleExists) {
        throw new Error(
          MESSAGES.admin.HEADING_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT
        );
      }

      moduleExists = await ModuleModel.findOne({
        subHeading,
         isDeleted: false,
       }).lean();

      if (moduleExists) {
        throw new Error(
          MESSAGES.admin.SUBHEADING_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT
        );
      }
      let modulePayload = await new ModuleModel(moduleData).save();
      modulePayload = await ModuleModel.findOne({ _id: modulePayload._id },PROJECTIONS.createModule).lean();
      if(moduleData.visFlow)
      {
      moduleData.visFlow.moduleId = modulePayload._id;
      let moduleVisFlow = await new VisModel(moduleData.visFlow).save();
      modulePayload.visFlow = moduleVisFlow;
      }
      return modulePayload;
    } catch (err) {
      throw err;
    }
  };

  this.getModule  = async () => {
    try {
      
      let module = await ModuleModel.find({},PROJECTIONS.createModule).lean();
      return module;
   
    } catch (err) {
      throw err;
    }
  };

  this.getModulebyid= async (_id) => {
    try {
      const moduleid=_id;
    
    
      let moduleExists = await ModuleModel.findById({ _id }).lean();
      if (moduleExists) {
        let modulePayload = await ModuleModel.findById({ _id },PROJECTIONS.createModule).lean();
        let moduleVisFlow = await VisModel.find({moduleId:moduleid},PROJECTIONS.createVis).lean();
        modulePayload.visFlow=moduleVisFlow;
        return modulePayload;
         
      } else {
       
        throw new Error(MESSAGES.admin.MODULE_WITH_ID_NOT_EXIST);
      }



    } catch (err) {
      throw err;
    }
  };

  this.updateModulebyid= async (findId,moduleData) => {
    try {

        await validations.validateUpdateModule(moduleData);
        let module = await this.checkModuleExists(findId);
        await ModuleModel.findOneAndUpdate(
          { _id: ObjectId(module._id) },
          moduleData
        );
        await VisModel.findOneAndUpdate({moduleId:module._id},moduleData.visFlow);
        module =await this.getModulebyid(module._id);
        return module;
      } catch (err) {
        throw err;
      }

  };



  this.checkModuleExists = async (findId) => {
    try {
      let isExists = false;
  
      const _id  = findId;
 
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
      let vis=await VisModel.findOneAndDelete({moduleId:ObjectId(findId)});
      return module;
    } catch (err) {
      throw err;
    }
  };



};
module.exports = ModuleDataManagement;