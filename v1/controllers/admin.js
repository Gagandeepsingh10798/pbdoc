const { AdminDataManagement ,ClientDataManagement} = require('../data-management');
const universal = require('../../utils');
const { CODES, MESSAGES } = require('../../constants');
module.exports = {
    signup: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            let admin = await AdminModel.createAdmin(req.body);
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
    /* Client APIs */
    createClient: async(req,res,next) => {
        try{

            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.createClient(req.body);
        
            await universal.response(res, CODES.OK, MESSAGES.admin.CLIENT_REGISTERED_SUCCESSFULLY,client);
        }
        catch(error){
            next(error);
        }
    },
  
 
    getClient: async(req,res,next) => {
        try{
          
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.getClient();
        
            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_REGISTERED_SUCCESSFULLY,client);
        }
        catch(error){
            next(error);
        }
    },
    getClientbyid:  async(req,res,next) => {
        try{
            let _id=req.params.id;
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.getClientbyid(_id);
        
            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_WITHID_SUCCESSFULLY,client);
        }
        catch(error){
            next(error);
        }
    },
    updateClient: async(req,res,next) => {
        try{
            let findId=req.params.id;
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.updateClientbyid(findId,req.body);

            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_UPDATED_SUCCESSFULLY,client);


        }catch(error){
            next(error);
        }
    },
    deleteClient:  async(req,res,next) => {
        try{
            let findId=req.params.id;
            let ClientModel = new ClientDataManagement();
            let client = await ClientModel.deleteClientbyid(findId);

            await universal.response(res, CODES.OK, MESSAGES.admin.CLIENT_DELETED_SUCCESSFULLY,client);


        }catch(error){
            next(error);
        }
    },
    createModule: async(req,res,next) => {
        try{

            let ModuleModel = new ClientDataManagement();
            let module = await ClientModel.createClient(req.body);
        
            await universal.response(res, CODES.OK, MESSAGES.admin.CLIENT_REGISTERED_SUCCESSFULLY,client);
        }
        catch(error){
            next(error);
        }
    }


    

};