const { UserDataManagement, ClientDataManagement, ModuleDataManagement, LogsDataManagement, ClientXModuleDataManagement} = require('../data-management');
const universal = require('../../utils');
const { CODES, MESSAGES } = require('../../constants');

module.exports = {
    login: async (req, res, next) => {
        try {
            let UserModel = new UserDataManagement();
            let user = await UserModel.checkUserExists({
                email: req.body.email || ''
            }, true);
            const { password } = req.body;
            delete req.body.password;
            const isPasswordMatched = await universal.comparePasswordUsingBcrypt(password, user.password);
            if (!isPasswordMatched) {
                throw new Error(MESSAGES.admin.PASSWORD_NOT_MATCH);
            }
            user = await UserModel.updateUser({ _id: user._id }, req.body);
            let tokens = await UserModel.createNewTokens(user._id);
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
            let UserModel = new UserDataManagement();
            await UserModel.clearTokens(req.user._id);
            await universal.response(res, CODES.OK, MESSAGES.admin.USER_LOGGED_OUT_SUCCESSFULLY, {});
        }
        catch (error) {
            next(error);
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            let UserModel = new UserDataManagement();
            let user = await UserModel.checkUserExists(req.body);
            await UserModel.createOtp("PASSWORD", user);
            await universal.response(res, CODES.OK, MESSAGES.admin.OTP_SENT_SUCCESSFULLY, {});
        }
        catch (error) {
            next(error);
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            let UserModel = new UserDataManagement();
            const { password, email, otp } = req.body;
            let user = await UserModel.checkUserExists({ email });
            await UserModel.verifyOtp("PASSWORD", user, otp);
            await UserModel.updateUser({ email }, { password });
            await universal.response(res, CODES.OK, MESSAGES.admin.PASSWORD_RESET_SUCCESSFULLY, {});
        }
        catch (error) {
            next(error);
        }
    },
    changePassword: async (req, res, next) => {
        try {
            let UserModel = new UserDataManagement();
            const { newPassword, oldPassword } = req.body;
            let isOldPasswordMatched = await universal.comparePasswordUsingBcrypt(oldPassword, req.user.password);
            if (!isOldPasswordMatched) throw new Error(MESSAGES.admin.OLD_PASSWORD_IS_INCORRECT);
            await UserModel.updateUser({ email: req.user.email }, { password: newPassword });
            await universal.response(res, CODES.OK, MESSAGES.admin.PASSWORD_CHANGE_SUCCESSFULLY, {});
        }
        catch (error) {
            next(error);
        }
    },
    getProfile: async (req, res, next) => {
        try {
            let UserModel = new UserDataManagement();
            let user = await UserModel.checkUserExists({ email: req.user.email });
            await universal.response(res, CODES.OK, MESSAGES.admin.PROFILE_FETCHED_SUCCESSFULLY, user);
        }
        catch (error) {
            next(error);
        }
    }
};