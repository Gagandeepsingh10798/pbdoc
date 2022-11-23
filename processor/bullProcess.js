const Queue=require("bull");
const {REDIS_URI,REDIS_PORT}= require('../config/redis');
const webpush = require("web-push");
const bullQueue= new Queue('bullQueue',{
    redis:{
        port:REDIS_PORT,host:REDIS_URI
    }
});
const Models = require("../data-models");
const mongoose = require("mongoose");
const { listenerCount } = require("../data-models/authToken");
const ObjectId = mongoose.Types.ObjectId;
const clientModel = Models.client;

const bullProcess = async (job, done) => {
  try {

    const _id = await job.data.clientId;
    let client = await clientModel.findById({_id}).lean();
   

    if(client.isActive)
    {
      
      console.log("Active");
    }
  
    else{
  console.log("inactive");

    }
    console.log("Get Client Successfully");
    done();
    }
  catch (err) {
    console.log(err);
  }
};
module.exports = bullProcess;
