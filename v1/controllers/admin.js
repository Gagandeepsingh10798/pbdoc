const { AdminDataManagement, ClientDataManagement, ModuleDataManagement, LogsDataManagement, ClientXModuleDataManagement} = require('../data-management');
const universal = require('../../utils');
const { CODES, MESSAGES } = require('../../constants');

module.exports = {
    signup: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            let admin = await AdminModel.createAdmin(req.file, req.body);
            await universal.response(res, CODES.OK, MESSAGES.admin.ADMIN_REGISTERED_SUCCESSFULLY, admin);
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            let user = await AdminModel.checkUserExists({
                email: req.body.email || ''
            }, true);
            const { password } = req.body;
            delete req.body.password;
            const isPasswordMatched = await universal.comparePasswordUsingBcrypt(password, user.password);
            if (!isPasswordMatched) {
                throw new Error(MESSAGES.admin.PASSWORD_NOT_MATCH);
            }
            user = await AdminModel.updateAdmin({ _id: user._id }, req.body);
            let tokens = await AdminModel.createNewTokens(user._id);
            user.authorization = {
                token: tokens.token,
                refreshToken: tokens.refreshToken
            };
            await universal.response(res, CODES.OK, MESSAGES.admin.USER_LOGGEDIN_SUCCESSFULLY, user);
        }
        catch (error) {
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            let AdminModel = new AdminDataManagement();
            await AdminModel.clearTokens(req.user._id);
            await universal.response(res, CODES.OK, MESSAGES.admin.USER_LOGGED_OUT_SUCCESSFULLY, {});
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
                profilePic: req.file,
                ...req.body
            };
            let AdminModel = new AdminDataManagement();
            let updateResult = await AdminModel.updateProfileById(updatePayload, req.user);
            await universal.response(res, CODES.OK, MESSAGES.admin.GETCLIENT_UPDATED_SUCCESSFULLY, updateResult);
        } catch (error) {
            next(error);
        }
    },
};