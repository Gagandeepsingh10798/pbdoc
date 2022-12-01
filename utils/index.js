const Messages = require('../langs');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const fs=require("fs");
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");
const { Blob } = require('buffer');
const { v1: uuidv1 } = require("uuid");
const Models = require('../data-models');
const {getEndpoints} = require('express-routes');
// const fs = require("fs");
const path = require("path");
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
            return  jwt.verify(token, config.get("JWT_OPTIONS").SECRET_KEY);
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
    deleteFilesByPath:async(path)=>
    {
        if(fs.existsSync(path)){
            await unlinkAsync(path);
        }
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
     uploadImage : async function(profile)  {
        try {
          var img = profile;
          console.log("udemy",img);
          const promise = fs.promises.readFile(path.join(img.path));
         console.log(promise);
                   const accountName = "livedemo1234";
      
          const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            new DefaultAzureCredential()
          );
         
          // Create a unique name for the container
          const containerName = 'quickstart';
          console.log('\nCreating container...');
          console.log('\t', containerName);
          const containerClient = blobServiceClient.getContainerClient(containerName);
      
          const blobName = 'quickstart' + uuidv1() + '.jpg';
      
          // Get a block blob client
          const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
          // Display blob name and url
          console.log(
            `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
          );
          // Upload data to the blob
          const uploadBlobResponse = await blockBlobClient.uploadFile(path.join(img.path));
          console.log(
            `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
          );
        
      
          // List the blob(s) in the container.
          var url = "";
          for await (const blob of containerClient.listBlobsFlat()) {
            // Get Blob Client from name, to get the URL
            const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
    
            url=tempBlockBlobClient.url;
          }
          console.log(url);
          return url;
        }
       
        catch (err) {
          console.log(`Error: ${err.message}`);
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
    addPermissionToDB : async(app)=>{
        try {
            Models.Apipermission.collection.drop();
            let allApi = getEndpoints(app);
            console.log(allApi);
            var n = new Models.Apipermission;
            n.userType = "ADMIN";
            allApi.forEach(e=>{
                n.permissions.push(e.path);
                // n.save(()=>{
                //     console.log("done");
                // });
            })
            n.save();
        } catch (error) {
            
        }
    },
    addApisToDB : async(app)=>{
    try{
        Models.Apis.collection.drop();
        let allapis = getEndpoints(app);
        
        allapis.forEach(e=>{
            var x = e.path;
            var n = new Models.Apis;
            n.path = e.path;
            n.methods = e.methods;
            n.name = x.substring(8),
            n.isDeleted = false,
            n.save()
        })   
    }catch(error)
    {
        throw error;
    }
    }
};