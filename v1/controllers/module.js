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
    getModulebyid: async (req, res, next) => {
        try {
            let _id = req.params.id;
            let ModuleModel = new ModuleDataManagement();
            let module = await ModuleModel.getModulebyid(_id);

            await universal.response(res, CODES.OK, MESSAGES.admin.PARTICULARMODULE_GET_SUCCESSFULLY, module);
        }
        catch (error) {
            next(error);
        }
    },
    updateModule: async (req, res, next) => {
        try {
            let findId = req.params.id;
            let ModuleModel = new ModuleDataManagement();
            let module = await ModuleModel.updateModulebyid(findId, req.body);

            await universal.response(res, CODES.OK, MESSAGES.admin.GETMODULE_UPDATED_SUCCESSFULLY, module);


        } catch (error) {
            next(error);
        }
    },
    deleteModule: async (req, res, next) => {
        try {
            let findId = req.params.id;
            let ModuleModel = new ModuleDataManagement();
            let module = await ModuleModel.deleteModulebyid(findId);

            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_DELETED_SUCCESSFULLY, module);


        } catch (error) {
            next(error);
        }
    },
    getlogs: async (req, res, next) => {
        try {

            let LogsModel = new LogsDataManagement();
            let logs = await LogsModel.getlogs();

            await universal.response(res, CODES.OK, MESSAGES.admin.GETLOGS_SUCCESSFULLY, logs);
        }
        catch (error) {
            next(error);
        }
    },
    getSingleLog: async (req, res, next) => {
        try {
            let LogsModel = new LogsDataManagement();
            let logs = await LogsModel.getSingleLog(req.params.logsId);

            await universal.response(res, CODES.OK, MESSAGES.admin.GETLOGS_SUCCESSFULLY, logs);
        }
        catch (error) {
            next(error);
        }
    },
    deleteLogs: async (req, res, next) => {
        try {

            let LogsModel = new LogsDataManagement();
            let logs = await LogsModel.deletelogs();

            await universal.response(res, CODES.OK, MESSAGES.admin.LOGS_DELETED_SUCCESSFULLY, logs);


        } catch (error) {
            next(error);
        }
    },
    deleteLog: async (req, res, next) => {
        try {
            let findId = req.params.id;
            let LogsModel = new LogsDataManagement();
            let logs = await LogsModel.deletelog(findId);

            await universal.response(res, CODES.OK, MESSAGES.admin.LOGS_DELETED_SUCCESSFULLY, logs);


        } catch (error) {
            next(error);
        }
    },
    clearLogs: async () => {
        const LogsModel = new LogsDataManagement();
        await LogsModel.clearLogs();
        return;
    },
    attachtable: async (req, res, next) => {
        try {

            let ClientXModuleModel = new ClientXModuleDataManagement();
            let module = await ClientXModuleModel.attachtable(req.params, req.body);
            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_REGISTERED_SUCCESSFULLY, module);
        }
        catch (error) {
            next(error);
        }
    },
    getattachtable: async (req, res, next) => {
        try {

            let ClientXModuleModel = new ClientXModuleDataManagement();
            let clientmoduledata = await ClientXModuleModel.getattachtable(req.params);

            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_REGISTERED_SUCCESSFULLY, clientmoduledata);
        }
        catch (error) {
            next(error);
        }
    },
    getModuleAttach: async (req, res, next) => {
        try {

            let ClientXModuleModel = new ClientXModuleDataManagement();
            let clientmoduledata = await ClientXModuleModel.getModuleAttach(req.params.moduleId);
            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_REGISTERED_SUCCESSFULLY, clientmoduledata);
        }
        catch (error) {
            next(error);
        }
    }
};