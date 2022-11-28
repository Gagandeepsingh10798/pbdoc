const { ClientDataManagement, ModuleDataManagement, LogsDataManagement, ClientXModuleDataManagement } = require('../data-management');
const universal = require('../../utils');
const { CODES, MESSAGES } = require('../../constants');
module.exports = {
    /* Client APIs */
    createClient: async (req, res, next) => {
        try {
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.createClient(req.file, req.body);
            await universal.response(res, CODES.OK, MESSAGES.admin.CLIENT_REGISTERED_SUCCESSFULLY, client);
        }
        catch (error) {
            next(error);
        }
    },
    getClients: async (req, res, next) => {
        try {
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.getClients(req.query);
            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_REGISTERED_SUCCESSFULLY, client);
        }
        catch (error) {
            next(error);
        }
    },
    getClientById: async (req, res, next) => {
        try {

            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.getClientById(req.params.id);

            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_WITHID_SUCCESSFULLY, client);
        }
        catch (error) {
            next(error);
        }
    },
    updateClientById: async (req, res, next) => {
        try {
            let findId = req.params.id;
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.updateClientById(req.file, findId, req.body);
            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_UPDATED_SUCCESSFULLY, client);
        } catch (error) {
            next(error);
        }
    },
    deleteClient: async (req, res, next) => {
        try {
            let findId = req.params.id;
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.deleteClientbyid(findId);
            await universal.response(res, CODES.OK, MESSAGES.admin.CLIENT_DELETED_SUCCESSFULLY, client);


        } catch (error) {
            next(error);
        }
    },
    createModule: async (req, res, next) => {
        try {

            let ModuleModel = new ModuleDataManagement();
            let module = await ModuleModel.createModule(req.body);

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
    },
    deletebyclientid: async (req, res, next) => {
        try {

            let ClientXModuleModel = new ClientXModuleDataManagement();
            let clientmoduledata = await ClientXModuleModel.deletebyclientid(req.params.clientid, req.body.modules);

            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_DELETED_SUCCESSFULLY, clientmoduledata);
        }
        catch (error) {
            next(error);
        }
    },
    getAllApi: async (req, res, next) => {
        try {
            let permissionModuleModel = new permissionDataManagement();
            let allapi = await permissionModuleModel.getAllApi();
            await universal.response(res, CODES.OK, MESSAGES.admin.GET_ALL_APIS, allapi);
        }
        catch (error) {
            next(error);
        }
    },
    addPermission: async (req, res, next) => {
        try {
            let permissionModuleModel = new permissionDataManagement();
            let addpermission = await permissionModuleModel.addPermission(req.body);
            await universal.response(res, CODES.OK, MESSAGES.admin.ADD_ALL_APIS_USERTYPE, addpermission);
        }
        catch (error) {
            console.log(error);
            next(error);
        }

    },
    getPermissionsByUserType: async (req, res, next) => {
        try {
            let permissionModuleModel = new permissionDataManagement();
            let getAllpermissionByuserType = await permissionModuleModel.getPermissionsByUserType(req.body);
            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_REGISTERED_SUCCESSFULLY, getAllpermissionByuserType);
        } catch (error) {
            next(error);
        }
    },
    deletePermissions: async (req, res, next) => {
        try {
            let permissionModuleModel = new permissionDataManagement();
            let deletePermissions = await permissionModuleModel.deletePermissions(req.body);
            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_REGISTERED_SUCCESSFULLY, deletePermissions);
        }
        catch (error) {
            next(error);
        }
    },
};