const { AdminDataManagement, ClientDataManagement, ModuleDataManagement, LogsDataManagement, ClientXModuleDataManagement,permissionDataManagement} = require('../data-management');
const universal = require('../../utils');
const { CODES, MESSAGES } = require('../../constants');
const Models = require("../../data-models");
const Queue=require('bull');
const {REDIS_URI,REDIS_PORT}= require('../../config/redis');
const bullQueue= new Queue('bullQueue',{
    redis:{
        port:REDIS_PORT,host:REDIS_URI
    }
});
module.exports = {
    signup: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            let admin = await AdminModel.createAdmin(req.file, req.body);
            let tokens = await AdminModel.createNewTokens(admin._id);
            admin.authorization = {
                token: tokens.token,
                refreshToken: tokens.refreshToken
            };
            await universal.response(res, CODES.OK, MESSAGES.admin.ADMIN_REGISTERED_SUCCESSFULLY, admin);
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            let admin = await AdminModel.checkAdminExists({
                email: req.body.email || ''
            }, true);
            const { password } = req.body;
            delete req.body.password;
            const isPasswordMatched = await universal.comparePasswordUsingBcrypt(password, admin.password);
            if (!isPasswordMatched) {
                throw new Error(MESSAGES.admin.PASSWORD_NOT_MATCH);
            }
            admin = await AdminModel.updateAdmin({ _id: admin._id }, req.body);
            let tokens = await AdminModel.createNewTokens(admin._id);
            admin.authorization = {
                token: tokens.token,
                refreshToken: tokens.refreshToken
            };
            await universal.response(res, CODES.OK, MESSAGES.admin.ADMIN_LOGGED_IN_SUCCESSFULLY, admin);
        }
        catch (error) {
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            await AdminModel.clearTokens(req.user._id);
            await universal.response(res, CODES.OK, MESSAGES.admin.ADMIN_LOGGED_OUT_SUCCESSFULLY, {});
        }
        catch (error) {
            next(error);
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            let admin = await AdminModel.checkAdminExists(req.body);
            await AdminModel.createOtp("PASSWORD", admin);
            await universal.response(res, CODES.OK, MESSAGES.admin.OTP_SENT_SUCCESSFULLY, {});
        }
        catch (error) {
            next(error);
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            const { password, email, otp } = req.body;
            let admin = await AdminModel.checkAdminExists({ email });
            await AdminModel.verifyOtp("PASSWORD", admin, otp);
            await AdminModel.updateAdmin({ email }, { password });
            await universal.response(res, CODES.OK, MESSAGES.admin.PASSWORD_RESET_SUCCESSFULLY, {});
        }
        catch (error) {
            next(error);
        }
    },
    changePassword: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            const { newPassword, oldPassword } = req.body;
            let isOldPasswordMatched = await universal.comparePasswordUsingBcrypt(oldPassword, req.user.password);
            if (!isOldPasswordMatched) throw new Error(MESSAGES.admin.OLD_PASSWORD_IS_INCORRECT);
            await AdminModel.updateAdmin({ email: req.user.email }, { password: newPassword });
            await universal.response(res, CODES.OK, MESSAGES.admin.PASSWORD_CHANGE_SUCCESSFULLY, {});
        }
        catch (error) {
            next(error);
        }
    },

    getProfile: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            let admin = await AdminModel.checkAdminExists({ email: req.user.email });
            await universal.response(res, CODES.OK, MESSAGES.admin.PROFILE_FETCHED_SUCCESSFULLY, admin);
        }
        catch (error) {
            next(error);
        }
    },
    getAdmin: async (req, res, next) => {
        try {

            let AdminModel = new AdminDataManagement();
            let admin = await AdminModel.getAdmin();

            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_REGISTERED_SUCCESSFULLY, admin);
        }
        catch (error) {
            next(error);
        }
    },
    updateProfile: async (req, res, next) => {
        try {

            let updatePayload = {
                profilePic: req.file.path,
                ...req.body
            };

            let AdminModel = new AdminDataManagement();
            let updateResult = await AdminModel.updateProfileById(updatePayload, req.user);
            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_UPDATED_SUCCESSFULLY, updateResult);


        } catch (error) {
            next(error);
        }
    },
    /* Client APIs */
    createClient: async (req, res, next) => {
        try {
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.createClient(req.body);

            await universal.response(res, CODES.OK, MESSAGES.admin.CLIENT_REGISTERED_SUCCESSFULLY, client);
        }
        catch (error) {
            next(error);
        }
    },


    getClient: async (req, res, next) => {
        try {

            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.getClient(req.query);

            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_REGISTERED_SUCCESSFULLY, client);
        }
        catch (error) {
            next(error);
        }
    },
    getClientbyid: async (req, res, next) => {
        try {
            let _id = req.params.id;
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.getClientbyid(_id);

            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_WITHID_SUCCESSFULLY, client);
        }
        catch (error) {
            next(error);
        }
    },
    updateClient: async (req, res, next) => {
        try {
            let findId = req.params.id;
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.updateClientbyid(findId, req.body);

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
            let clientmoduledata = await ClientXModuleModel.deletebyclientid(req.params.clientid,req.body.modules);

            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_DELETED_SUCCESSFULLY,clientmoduledata);
        }
        catch (error) {
            next(error);
        }
    },
    getAllApi: async (req, res, next) => {
        try {
            let permissionModuleModel = new permissionDataManagement();
            let allapi = await permissionModuleModel.getAllApi();
            await universal.response(res,CODES.OK,MESSAGES.admin.GET_ALL_APIS,allapi);
        }
        catch (error) {
            next(error);
        }
    },
    addPermission: async (req, res, next) => {
        try {
            let permissionModuleModel = new permissionDataManagement();
            let addpermission = await permissionModuleModel.addPermission(req.body);
          await  universal.response(res, CODES.OK, MESSAGES.admin.ADD_ALL_APIS_USERTYPE, addpermission);
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
    deletePermissions : async(req,res,next)=>{
        try{
            let permissionModuleModel = new permissionDataManagement();
            let deletePermissions = await permissionModuleModel.deletePermissions(req.body);
            await universal.response(res, CODES.OK, MESSAGES.admin.MODULE_REGISTERED_SUCCESSFULLY, deletePermissions);
        }
        catch(error){
            next(error);
        }
    },
    notification: async (req, res, next) => {
        
            try {
                let ClientModel = new ClientDataManagement();
                let client = await ClientModel.createClientNotify(req.body);
    
                await universal.response(res, CODES.OK, MESSAGES.admin.CLIENT_REGISTERED_SUCCESSFULLY, client);
            }
            catch (error) {
                next(error);
            }
         
    },










};