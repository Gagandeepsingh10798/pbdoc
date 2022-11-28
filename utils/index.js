const Messages = require('../langs');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const { BlockBlobClient, BlobServiceClient } = require('@azure/storage-blob');
const blobServiceClient = BlobServiceClient.fromConnectionString(config.get("AZURE_STORAGE_CONNECTION_STRING"));
const containerName = config.get("AZURE_STORAGE_CONTAINER_NAME");
const getStream = require('into-stream');
const Models = require('../data-models');
const { MESSAGES } = require('../constants');
module.exports = {
    /*
    Response Functions
    */
    errMessage: async (res, status, message, lang) => { await res.status(status).send({ status: status, message: Messages[lang][message] }); },
    sucMessage: async (res, status, message, data, lang) => { await res.send({ status: status, message: Messages[lang][message], result: data }); },
    response: async (res, status, message, data) => {
        if (status != 200) {
            await res.status(status).send({ status: status, message: Messages.en[message], result: data });
        }
        else {
            await res.status(status).send({ status: status, message: Messages.en[message], result: data });
        }
    },
    /*
    Bcrypt Functions
    */
    hashPasswordUsingBcrypt: async (password) => { return bcrypt.hashSync(password, 10); },
    comparePasswordUsingBcrypt: async (pass, hash) => { return bcrypt.compareSync(pass, hash); },
    /*
    JWT Functions
    */
    createAuthToken: async (payload) => {
        try {
            return jwt.sign(
                payload,
                config.get("JWT_OPTIONS").SECRET_KEY,
                {
                    expiresIn: config.get("JWT_OPTIONS").TOKEN_EXPIRES_IN
                }
            );
        } catch (error) {
            throw error;
        }
    },
    createRefreshToken: async (payload) => {
        try {
            return jwt.sign(
                payload,
                config.get("JWT_OPTIONS").SECRET_KEY,
                {
                    expiresIn: config.get("JWT_OPTIONS").REFRESH_TOKEN_EXPIRES_IN
                }
            );
        } catch (error) {
            throw error;
        }
    },
    verifyAuthToken: async (token) => {
        try {
            return await jwt.verify(token, config.get("JWT_OPTIONS").SECRET_KEY);
        } catch (error) {
            throw error;
        }
    },
    deleteFilesByPath: async (path) => {
        if (fs.existsSync(path)) {
            await unlinkAsync(path);
        }
    },
    /*
    Otp
    */
    generateOtp: async () => {
        try {
            const digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 4; i++) { OTP += digits[Math.floor(Math.random() * 10)]; }
            return OTP;
        } catch (error) {
            throw error;
        }
    },
    getBlobName: (file) => {
        const identifier = file.fieldname + '-' + Date.now() + `.${file.originalname.split('.').pop()}`; // remove "0." from start of string
        return identifier;
    },
    uploadFile: async function (file) {
        try {
            const blobName = this.getBlobName(file);
            const blobService = new BlockBlobClient(config.get("AZURE_STORAGE_CONNECTION_STRING"), containerName, blobName);
            const stream = getStream(file.buffer);
            const streamLength = file.buffer.length;
            await blobService.uploadStream(stream, streamLength);
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobs = containerClient.listBlobsFlat();
            let URL = "";
            for await (let blob of blobs) {
                if (blob.name === blobName) {
                    URL = containerClient.getBlockBlobClient(blob.name).url;
                    break;
                }
            }
            return URL;
        }
        catch (err) {
            console.log(`Error: ${err.message}`);
        }
    },
    deleteFile: async function (fileUrl) {
        try {
            const options = {
                deleteSnapshots: 'include' // or 'only'
            };
            let blobName = fileUrl.split('/');
            blobName = blobName[blobName.length - 1];
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.deleteIfExists(options);
            return true;
        }
        catch (err) {
            return false;
        }
    },
    validateApiPermissions: async (req, res, next) => {
        let API_PERMISSIONS = {
            WITHOUT_AUTH_APIS: [
                '/api/v1/admin/login',
                '/api/v1/client'
            ],
            ADMIN: [

            ],
            CLIENT: [
                'api/v1/'
            ]
        };

        try {
            let URL = req.originalUrl;
            let allowed = false;
            if (API_PERMISSIONS.WITHOUT_AUTH_APIS.includes(URL)) {
                return next();
            }
            if (req.headers.authorization) {
                let authToken = req.headers.authorization;
                let decodedToken = await jwt.verify(authToken, config.get("JWT_OPTIONS").SECRET_KEY);
                req.user = await Models.user.findOne({ _id: decodedToken._id }).lean();
                allowed = API_PERMISSIONS[req.user.type].includes(URL);
                if (allowed) {
                    return next();
                }
                else {
                    throw new Error(MESSAGES.admin.NOT_AUTHORIZED);
                }
            }
            else {
                throw new Error(MESSAGES.admin.AUTHORIZATION_IS_MISSING);
            }
        }
        catch (err) {
            next(err);
        }
    }

};