const Messages = require('../langs');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const fs=require("fs");
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
// const fs = require("fs");
// const path = require("path");
// const ffmpeg = require('fluent-ffmpeg')
// const { Parser } = require('json2csv');
// const csv = require('csv-parser')
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
    // /*
    // Generate Thumbnail Functions
    // */
    // generateVideoThumbnail: async (paths, saveLocation) => {
    //     try {
    //         ffmpeg(paths)
    //             .screenshots({
    //                 filename: paths.split('/')[paths.split('/').length - 1] + "_thumbnail.png",
    //                 folder: path.join(__dirname, saveLocation),
    //                 count: 1
    //             }).on('error', (e) => {
    //                 console.log({ e })
    //                 return false
    //             })
    //             .on('end', async () => {
    //                 return true
    //             })
    //     } catch (error) {
    //         throw error;
    //     }
    // },
    // /*
    // File Functions
    // */

    // deleteFiles: async (paths) => {
    //     await paths.forEach(filePath => fs.unlinkSync(path.resolve(__dirname, '..' + filePath)))
    //     return
    // },
    deleteFilesByPath:async(paths)=>
    {
      await unlinkAsync(paths);
    },
    // /*
    // Email Service
    // */
    // emailService: require('./Email'),
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
    // getStatus: (statusString) => {
    //     const status = {
    //         "NOT ACCEPTED": 0,
    //         "ACCEPTED": 1,
    //         "LOADED": 2,
    //         "DISPATCHED": 3,
    //         "ARRIVED": 4,
    //         "DELIVERED": 5,
    //         "REJECTED": 6
    //     }
    //     console.log({ status: status[statusString] });
    //     return status[statusString]
    // },
    // pushNotification: require('./Notification'),
    // smsNotification: require('./Sms'),
    // csvParser: async (fileName) => {
    //     let records = [];
    //     return new Promise(function (resolve, reject) {
    //         fs.createReadStream(path.resolve(__dirname, `../uploads/files/virtual/${fileName}`))
    //             .pipe(csv())
    //             .on('data', function (row) {
    //                 records.push(row);
    //             })
    //             .on('end', function () {
    //                 resolve(records);
    //             })
    //             .on('error', reject);
    //     })
    // }
};