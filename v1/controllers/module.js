const { ModuleDataManagement, LogsDataManagement, ClientXModuleDataManagement } = require('../data-management');
const universal = require('../../utils');
const { CODES, MESSAGES } = require('../../constants');
module.exports = {
    createModule: async (req, res, next) => {
        try {

            let ModuleModel = new ModuleDataManagement();
            let module = await ModuleModel.createModule(req.file, req.body);

            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_REGISTERED_SUCCESSFULLY, module);
        }
        catch (error) {
            next(error);
        }
    },
    getModule: async (req, res, next) => {
        try {

            let ModuleModel = new ModuleDataManagement();
            let module = await ModuleModel.getModule();

            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_GET_SUCCESSFULLY, module);
        }
        catch (error) {
            next(error);
        }
    },
    getModuleById: async (req, res, next) => {
        try {
            let _id = req.query.id;
            let ModuleModel = new ModuleDataManagement();
            let module = await ModuleModel.getModuleById(_id);

            await universal.response(res, CODES.OK, MESSAGES.admin.PARTICULARMODULE_GET_SUCCESSFULLY, module);
        }
        catch (error) {
            next(error);
        }
    },
    updateModule: async (req, res, next) => {
        try {
            let findId = req.query.id;
            let ModuleModel = new ModuleDataManagement();
            let module = await ModuleModel.updateModuleById(findId, req.file, req.body);
            await universal.response(res, CODES.OK, MESSAGES.admin.GETMODULE_UPDATED_SUCCESSFULLY, module);
        } catch (error) {
            next(error);
        }
    },
};