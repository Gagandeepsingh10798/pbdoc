const Queue=require('bull');
const path=require('path');
const config = require('config');
const mongoose = require('mongoose');
const {REDIS_URI,REDIS_PORT}= require('../config/redis');
const bullQueue= new Queue('bullQueue',{
    redis:{
        port:REDIS_PORT,host:REDIS_URI
    }
});

bullQueue.process(path.join(__dirname,'bullProcess.js'));
