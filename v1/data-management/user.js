const Models = require("../../data-models");
const validations = require("./validations");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const universal = require("../../utils");
const config = require("config");
const USER_TYPES = config.get('USER_TYPES');
const ObjectId = require("mongoose").Types.ObjectId;
const moment = require("moment");
const UserDataManagement = function () {
  const UserModel = Models.user;
  const AdminDetailsModel = Models.adminDetails;
  const ClientDetailsModel = Models.clientDetails;
  const AuthTokenModel = Models.authToken;
  const OtpModel = Models.otp;

  this.findUserDetailsByUserType = async (user, Projection) => {
    try{
      switch(user.type){
        case USER_TYPES.ADMIN:
          return await AdminDetailsModel.findOne({ userId: user._id },Projection).lean();
        case USER_TYPES.CLIENT:
          return await ClientDetailsModel.findOne({ userId: user._id },Projection).lean();
        default:
          throw new Error(MESSAGES.admin.USER_NOT_EXISTS);
      }
    }
    catch(err){
      throw new Error(MESSAGES.admin.USER_NOT_EXISTS);
    }
  };

  this.updateUserDetailsByUserType = async (user, userData) => {
    try{
      switch(user.type){
        case USER_TYPES.ADMIN:
          await AdminDetailsModel.findOneAndUpdate({ _id: ObjectId(user._id) },userData);
          return await AdminDetailsModel.findOne({ userId: user._id }).lean();
        case USER_TYPES.CLIENT:
          await ClientDetailsModel.findOneAndUpdate({ _id: ObjectId(user._id) },userData);
          return await ClientDetailsModel.findOne({ userId: user._id }).lean();
        default:
          throw new Error(MESSAGES.admin.USER_NOT_EXISTS);
      }
    }
    catch(err){
      throw new Error(MESSAGES.admin.USER_NOT_EXISTS);
    }
  };

  this.checkUserExists =  async (userData, isLogin) => {
    try {
      const Projection = isLogin ? PROJECTIONS.createAdminWithPassword : PROJECTIONS.createAdmin;
      await validations.validateCheckAdminExists(userData);
      let isExists = false;
      const { email, phone, countryCode, _id } = userData;
      if (_id) {
        isExists = await UserModel.findOne(
          { _id: ObjectId(_id), isDeleted: false },
          Projection
        ).lean();
      } else if (email) {
        isExists = await UserModel.findOne(
          {  email, isDeleted: false },
          Projection
        ).lean();
      } else if (phone && countryCode) {
        isExists = await UserModel.findOne(
          { phone, countryCode, isDeleted: false },
          Projection
        ).lean();
      }

      if (!isExists) throw new Error(MESSAGES.admin.USER_NOT_EXISTS);
      let userDetails = await this.findUserDetailsByUserType(isExists, Projection);
      
      isExists = {
        ...userDetails,
        ...isExists
      };
      return isExists;
    } catch (err) {
      throw err;
    }
  };

  this.updateUser = async (findByData, userData) => {
    try {
      await validations.validateUpdateUser(userData);
      let user = await this.checkUserExists(findByData);
      if (userData && userData.password) {
        userData.password = await universal.hashPasswordUsingBcrypt(userData.password);
      }

      await UserModel.findOneAndUpdate({ _id: ObjectId(user._id) },userData).lean();
      user = await UserModel.findOne({ _id: ObjectId(user._id) }, PROJECTIONS.createAdmin).lean();

      let userDetails = await this.updateUserDetailsByUserType(user, userData);
    
      user = {
        ...userDetails,
        ...user
      };

      return user;
    } catch (err) {
      throw err;
    }
  };

  this.createNewTokens = async (userId) => {
    try {
      userId = ObjectId(userId);
      await this.checkUserExists({ _id: userId });
      let tokens = await AuthTokenModel.findOne({ user: userId }).lean();
      if (tokens) {
        try {
          await universal.verifyAuthToken(tokens.token);
        } catch (error) {
          let newTokens = {
            token: await universal.createAuthToken({ _id: tokens.user }),
            refreshToken: await universal.createRefreshToken({
              _id: tokens.user,
            }),
          };
          await AuthTokenModel.findOneAndUpdate(
            { user: userId },
            newTokens
          ).lean();
          tokens = await AuthTokenModel.findOne({ user: userId }).lean();
        }
      } else {
        let newTokens = {
          token: await universal.createAuthToken({ _id: userId }),
          refreshToken: await universal.createRefreshToken({ _id: userId }),
          user: userId,
        };
        await new AuthTokenModel(newTokens).save();
        tokens = await AuthTokenModel.findOne({ user: userId }).lean();
      }
      return tokens;
    } catch (err) {
      throw err;
    }
  };

  this.clearTokens = async (userId) => {
    try {
      userId = ObjectId(userId);
      await this.checkUserExists({ _id: userId });
      await AuthTokenModel.findOneAndUpdate(
        { user: userId },
        { token: "", refreshToken: "" }
      ).lean();
      return;
    } catch (err) {
      throw err;
    }
  };

  this.createOtp = async (type, userData) => {
    let OTP = {
      email: userData.email || "",
      phone: userData.phone || "",
      countryCode: userData.countryCode || "",
      type,
    };
    let isOtpExists = await OtpModel.findOne(OTP).lean();
    if (isOtpExists && moment(isOtpExists.expireAt) >= moment()) {
      throw new Error(MESSAGES.admin.OTP_ALREADY_SENT);
    } else if (isOtpExists && moment(isOtpExists.expireAt) < moment()) {
      await OtpModel.findByIdAndDelete(isOtpExists._id);
    }
    OTP.expireAt = moment().add(3, "minutes");
    OTP.code = "0000";
    await new OtpModel(OTP).save();
  };

  this.verifyOtp = async (type, userData, otp) => {
    let OTP = {
      code: otp,
      email: userData.email || "",
      phone: userData.phone || "",
      countryCode: userData.countryCode || "",
      type,
    };
    let isOtpExists = await OtpModel.findOne(OTP).lean();
    if (!isOtpExists) throw new Error(MESSAGES.admin.OTP_EXPIRED);
    if (isOtpExists && moment(isOtpExists.expireAt) < moment()) {
      await OtpModel.findByIdAndDelete(isOtpExists._id);
      throw new Error(MESSAGES.admin.OTP_EXPIRED);
    }
    await OtpModel.findByIdAndDelete(isOtpExists._id);
  };

  this.updateProfileById = async (updatePayload, userPayload) => {
    let profilePicUploaded = false;
    try {
      let userId = ObjectId(userPayload._id);
      if (updatePayload.profilePic) {
        if (userPayload.profilePic) {
          await universal.deleteFile(userPayload.profilePic);
        }
        updatePayload.profilePic = await universal.uploadFile(updatePayload.profilePic);
        profilePicUploaded = true;
      }
      await UserModel.findOneAndUpdate({ _id: userId }, updatePayload);
      let user = await UserModel.findOne({ _id: userId }, PROJECTIONS.createAdmin).lean();
      let userDetails = await this.updateUserDetailsByUserType(user,updatePayload);
      userDetails = this.findUserDetailsByUserType(user, PROJECTIONS.createAdmin);
      user = {
        ...userDetails,
        ...user
      };
      return user;
    } catch (err) {
      if (profilePicUploaded && updatePayload.profilePic) {
        await universal.deleteFile(updatePayload.profilePic);
      }
      throw err;
    }
  };

};

module.exports = UserDataManagement;
