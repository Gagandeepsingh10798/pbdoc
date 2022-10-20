const Models = require("../../data-models");
const validations = require("./validations");
const PROJECTIONS = require("./Projections");
const { MESSAGES } = require("../../constants");
const universal = require("../../utils");
const config = require("config");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const ClientDataManagement = function () {
  const ClientModel = Models.client;

  this.createClient = async (clientData) => {
    try {
      await validations.validateCreateCLient(clientData);
      const { email, phone, countryCode } = clientData;

      let clientExists = await ClientModel.findOne({
        email,
        isDeleted: false,
      }).lean();
      if (clientExists) {
        throw new Error(
          MESSAGES.admin.EMAIL_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT
        );
      }
      clientExists = await ClientModel.findOne({
        phone,
        countryCode,
        isDeleted: false,
      }).lean();
      if (clientExists) {
        throw new Error(
          MESSAGES.admin.PHONE_NUMBER_ALREADY_ASSOCIATED_WITH_ANOTHER_ACCOUNT
        );
      }

      let client = await new ClientModel(clientData).save();

      console.log(client);
      client = await ClientModel.findOne(
        { _id: client._id },
        PROJECTIONS.createClient
      ).lean();

      return client;
    } catch (err) {
      throw err;
    }
  };

  this.getClient = async (queryData) => {
    try {
      //
      await validations.validatequeryClient(queryData);
      const { limit, page } = queryData;
      console.log(limit);
      var limits = limit ? +limit : 10;
      var skip = page ? (page - 1) * limits : 0;
      let client = await ClientModel.find({}, PROJECTIONS.createClient).lean();
      if (client.length > 0) {
        console.log(limits);
       
          let clients = await ClientModel.find({}, PROJECTIONS.createClient)
            .limit(limits)
            .skip(skip)
            .lean();
          return clients;
        
      } else {
        throw new Error(MESSAGES.admin.CLIENTS_NOT_EXIST);
      }
    } catch (err) {
      throw err;
    }
  };

  this.getClientbyid = async (_id) => {
    try {
      let clientExists = await ClientModel.findById({ _id }).lean();
      if (clientExists) {
        let client = await ClientModel.findById(
          { _id },
          PROJECTIONS.createClient
        ).lean();
        return client;
      } else {
        throw new Error(MESSAGES.admin.CLIENT_WITH_ID_NOT_EXIST);
      }
    } catch (err) {
      throw err;
    }
  };

  this.updateClientbyid = async (findId, clientData) => {
    try {
      await validations.updateCreateCLient(clientData);
      let client = await this.checkClientExists(findId);
      await ClientModel.findOneAndUpdate(
        { _id: ObjectId(client._id) },
        clientData
      );
      client = await ClientModel.findOne(
        { _id: ObjectId(client._id) },
        PROJECTIONS.createClient
      ).lean();
      return client;
    } catch (err) {
      throw err;
    }
  };

  this.checkClientExists = async (findId) => {
    try {
      let isExists = false;

      const _id = findId;

      if (_id) {
        isExists = await ClientModel.findOne({
          _id: ObjectId(_id),
          isDeleted: false,
        }).lean();
      }

      console.log(isExists);

      if (!isExists) throw new Error(MESSAGES.admin.CLIENT_WITH_ID_NOT_EXIST);

      return isExists;
    } catch (err) {
      throw err;
    }
  };

  this.deleteClientbyid = async (findId) => {
    try {
      let client = await this.checkClientExists(findId);
      await ClientModel.findOneAndDelete({ _id: ObjectId(client._id) });
      client = await ClientModel.findOne({ _id: ObjectId(client._id) }).lean();
      return client;
    } catch (err) {
      throw err;
    }
  };
};
module.exports = ClientDataManagement;
