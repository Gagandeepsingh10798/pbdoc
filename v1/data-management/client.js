const Models = require("../../data-models");
const validations = require("./validations");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const config = require("config");
const universal = require("../../utils");

const ClientDataManagement = function () {
  const ClientModel = Models.user;
  const ClientDetailsModel = Models.clientDetails;
  const AuthTokenModel = Models.authToken;

  this.createClient = async (logo, clientData) => {
    let logoUploaded = false;
    try {
      let userType = await config.get("USER_TYPES").CLIENT;
      await validations.validateCreateCLient(clientData);
      const { email, phone, countryCode, userName } = clientData;

      let clientExists = await ClientModel.findOne({ userName, isDeleted: false, }).lean();
      if (clientExists) {
        throw new Error(
          MESSAGES.admin.USERNAME_ALREADY_EXISTS
        );
      }

      clientExists = await ClientModel.findOne({ email, isDeleted: false }).lean();
      if (clientExists) {
        throw new Error(
          MESSAGES.admin.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT
        );
      }

      clientExists = await ClientModel.findOne({ phone, countryCode, isDeleted: false, }).lean();
      if (clientExists) {
        throw new Error(
          MESSAGES.admin.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT
        );
      }

      if (logo) {
        clientData.logo = await universal.uploadFile(logo);
        logoUploaded = true;
      }

      clientData.type = userType;
      clientData.password = await universal.hashPasswordUsingBcrypt(clientData.password);

      let client = await new ClientModel(clientData).save();
      client = await ClientModel.findOne({ _id: client._id }, PROJECTIONS.createAdmin).lean();

      clientData.userId = client._id;

      let clientDetails = await new ClientDetailsModel(clientData).save();
      clientDetails = await ClientDetailsModel.findOne({ userId: client._id }, PROJECTIONS.createAdmin).lean();

      let authTokenPayload = {
        token: await universal.createAuthToken({ _id: client._id }),
        refreshToken: await universal.createRefreshToken({ _id: client._id }),
        user: client._id,
      };
      await new AuthTokenModel(authTokenPayload).save();

      client.authorization = {
        token: authTokenPayload.token,
        refreshToken: authTokenPayload.refreshToken,
      };

      client = {
        ...clientDetails,
        ...client
      };
      console.log(client);
      return client;
    } catch (err) {
      if (logoUploaded && clientData.logo) {
        await universal.deleteFile(clientData.logo);
      }
      throw err;
    }
  };

  this.getClients = async (queryData) => {
    try {
      let matchStatement = {
        $match: {
          "isDeleted": false
        }
      }

      if(queryData.id){
        matchStatement = {
          $match: {
            "userId":  ObjectId(queryData.id),
            "isDeleted": false
          }
        }
      }

      let pipeline = [
        matchStatement,
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $unwind: "$userId",
        },
        {
          $project: PROJECTIONS.getClients
        }
      ]

      let clients = await ClientDetailsModel.aggregate(pipeline);
      if(queryData.id && clients.length){
          return clients[0];
      }
      return clients;
    } catch (err) {
      throw err;
    }
  };

  this.getClientById = async (_id) => {
    try {

      let clients = await ClientDetailsModel.aggregate([
        {
          $match: {
            isDeleted: false,
            userId: ObjectId(_id)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $unwind: "$userId",
        },
        {
          $project: PROJECTIONS.getClients
        }
      ]);

      if (clients.length) {
        return clients[0];
      } else {
        throw new Error(MESSAGES.admin.CLIENT_WITH_ID_NOT_EXIST);
      }
    } catch (err) {
      throw err;
    }
  };

  this.updateClientById = async (logo, findId, clientData) => {
    let logoUploaded = false;
    try {
      let userId = ObjectId(findId);
      let client = await this.getClientById(findId);
      await ClientModel.findOneAndUpdate({ _id: userId }, clientData);

      if (logo) {
        clientData.logo = await universal.uploadFile(logo);
        logoUploaded = true;
        if (client.logo) {
          await universal.deleteFile(client.logo);
        }
      }

      await ClientDetailsModel.findOneAndUpdate({ userId }, clientData);
      client = await this.getClientById(findId);
      return client;
    } catch (err) {
      if (logoUploaded && clientData.logo) {
        await universal.deleteFile(clientData.logo);
      }
      throw err;
    }
  };

};
module.exports = ClientDataManagement;
