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
            let findId = req.query.id;
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.updateClientById(req.file, findId, req.body);
            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_UPDATED_SUCCESSFULLY, client);
        } catch (error) {
            next(error);
        }
    },
    updateClientByClient: async (req, res, next) => {
        try {
            let findId = req.user._id;
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
    attachModules: async (req, res, next) => {
        try {
            let ClientXModuleModel = new ClientXModuleDataManagement();
            let ClientXModules = await ClientXModuleModel.attachModules(req.body.modules, req.query.clientId);
            await universal.response(res, CODES.OK, MESSAGES.admin.CLIENT_DELETED_SUCCESSFULLY, ClientXModules);
        } catch (error) {
            next(error);
        }
    },
    getAttachedModules: async (req, res, next) => {
        try {
            let ClientXModuleModel = new ClientXModuleDataManagement();
            let ClientXModules = await ClientXModuleModel.getAttachedModules(req.query.clientId);
            await universal.response(res, CODES.OK, MESSAGES.admin.CLIENT_DELETED_SUCCESSFULLY, ClientXModules);
        } catch (error) {
            next(error);
        }
    },
};