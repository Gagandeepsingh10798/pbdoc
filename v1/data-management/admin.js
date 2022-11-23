const Models = require("../../data-models");
const validations = require("./validations");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const universal = require("../../utils");
const fs = require("fs");
const config = require("config");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const AdminDataManagement = function () {
  const AdminModel = Models.user;
  const AuthTokenModel = Models.authToken;
  const OtpModel = Models.otp;
    
  this.createAdmin = async (profile, adminData) => {
    try {
            console.log(profile);
      await validations.validateCreateAdmin(adminData);
      const { email, phone, countryCode } = adminData;
      let userType = await config.get("USER_TYPES").ADMIN;
      let userExists = await AdminModel.findOne({
        type: userType,
        email,
        isDeleted: false,
      }).lean();
            console.log(userExists);
      if (userExists) {
        await unlinkAsync(profile.path);
        throw new Error(
          MESSAGES.admin.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT
        );
      }
      userExists = await AdminModel.findOne({
        type: userType,
        phone,
        countryCode,
        isDeleted: false,
      }).lean();
      if (userExists) {
        await unlinkAsync(profile.path);
        throw new Error(
          MESSAGES.admin.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT
        );
      }

      adminData.profilePic = await universal.uploadImage(profile);
      adminData.type = userType;
      adminData.password = await universal.hashPasswordUsingBcrypt(
        adminData.password
      );
      let admin = await new AdminModel(adminData).save();
      admin = await AdminModel.findOne(
        { _id: admin._id },
        PROJECTIONS.createAdmin
      ).lean();
      let authTokenPayload = {
        token: await universal.createAuthToken({ _id: admin._id }),
        refreshToken: await universal.createRefreshToken({ _id: admin._id }),
        user: admin._id,
      };
      await new AuthTokenModel(authTokenPayload).save();
      admin.authorization = {
        token: authTokenPayload.token,
        refreshToken: authTokenPayload.refreshToken,
      };
      return admin;
    } catch (err) {
      throw err;
    }
  };

  this.checkAdminExists = async (adminData, isLogin) => {
    try {
      const Projection = isLogin
        ? PROJECTIONS.createAdminWithPassword
        : PROJECTIONS.createAdmin;
      await validations.validateCheckAdminExists(adminData);
      let isExists = false;
      let userType = await config.get("USER_TYPES").ADMIN;
      const { email, phone, countryCode, _id } = adminData;
      if (_id) {
        isExists = await AdminModel.findOne(
          { type: userType, _id: ObjectId(_id), isDeleted: false },
          Projection
        ).lean();
      } else if (email) {
        isExists = await AdminModel.findOne(
          { type: userType, email, isDeleted: false },
          Projection
        ).lean();
      } else if (phone && countryCode) {
        isExists = await AdminModel.findOne(
          { type: userType, phone, countryCode, isDeleted: false },
          Projection
        ).lean();
      }

      if (!isExists) throw new Error(MESSAGES.admin.ADMIN_NOT_EXIST);
      return isExists;
    } catch (err) {
      throw err;
    }
  };

  this.updateAdmin = async (findByData, adminData) => {
    try {
      await validations.validateUpdateAdmin(adminData);
      let admin = await this.checkAdminExists(findByData);
      if (adminData && adminData.password) {
        adminData.password = await universal.hashPasswordUsingBcrypt(
          adminData.password
        );
      }
      await AdminModel.findOneAndUpdate(
        { _id: ObjectId(admin._id) },
        adminData
      );
      admin = await AdminModel.findOne(
        { _id: ObjectId(admin._id) },
        PROJECTIONS.createAdmin
      ).lean();
      return admin;
    } catch (err) {
      throw err;
    }
  };

  this.createNewTokens = async (adminId) => {
    try {
      adminId = ObjectId(adminId);
      await this.checkAdminExists({ _id: adminId });
      let tokens = await AuthTokenModel.findOne({ user: adminId }).lean();
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
            { user: adminId },
            newTokens
          ).lean();
          tokens = await AuthTokenModel.findOne({ user: adminId }).lean();
        }
      } else {
        let newTokens = {
          token: await universal.createAuthToken({ _id: adminId }),
          refreshToken: await universal.createRefreshToken({ _id: adminId }),
          user: adminId,
        };
        await new AuthTokenModel(newTokens).save();
        tokens = await AuthTokenModel.findOne({ user: adminId }).lean();
      }
      return tokens;
    } catch (err) {
      throw err;
    }
  };

  this.clearTokens = async (adminId) => {
    try {
      adminId = ObjectId(adminId);
      await this.checkAdminExists({ _id: adminId });
      await AuthTokenModel.findOneAndUpdate(
        { user: adminId },
        { token: "", refreshToken: "" }
      ).lean();
      return;
    } catch (err) {
      throw err;
    }
  };

  this.createOtp = async (type, adminData) => {
    let OTP = {
      email: adminData.email || "",
      phone: adminData.phone || "",
      countryCode: adminData.countryCode || "",
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

  this.verifyOtp = async (type, adminData, otp) => {
    let OTP = {
      code: otp,
      email: adminData.email || "",
      phone: adminData.phone || "",
      countryCode: adminData.countryCode || "",
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
    try {
      let userId = ObjectId(userPayload._id);
      if (updatePayload.profilePic)
        await universal.deleteFilesByPath(userPayload.profilePic);
      await AdminModel.findOneAndUpdate({ _id: userId }, updatePayload);
      return await AdminModel.findOne(
        { _id: userId },
        PROJECTIONS.createClient
      ).lean();
    } catch (err) {
      throw err;
    }
  };
};

module.exports = AdminDataManagement;
