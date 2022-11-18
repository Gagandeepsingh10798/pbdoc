const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const http = require("http");
const {getEndpoints} = require('express-routes');
const cors = require("cors");
const morgan = require('morgan');
const express = require("express");
const path = require("path");
const Models = require("./data-models");
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger-doc/v1/client/swagger.json');
const swaggerdocumentmodule = require("./swagger-doc/v1/module/swagger.json");
const swaggerdocumentlogs = require("./swagger-doc/v1/logs/swagger.json");
const controllers = require('./v1/controllers');
const cron = require('node-cron');
const route = require('./route');
const app = express();
const helperFunctions = require('./utils/index')
app.use(cors());

/*
Initialize Server
*/
let server = http.createServer(app);
server.listen(config.get('PORT'), () => {
    console.log(`****************************************** ${'ENVIRONMENT:::' + process.env.NODE_ENV} *******************************************************`);
    console.log(`****************************************** ${'PORT:::' + config.get('PORT')} *******************************************************`);
});

/*
Database Connection
*/
mongoose.connect(config.get('DB_URL'), { useNewUrlParser: true, useUnifiedTopology: true })
.then(
    async (db) => {
        console.log(`******************************************MONGODB CONNECTED ***********************************************`)
        await helperFunctions.addApisToDB(app)
    },
    (err) => console.log("MongoDB " + String(err.message)),
);

/* 
View Engine Setup
*/
app.set("view engine", "ejs");

/*
Middelwares
*/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
Test API
*/
app.use('/test', async (req, res, next) => {
    res.status(200).send({ status: 200, message: "TEST API", data: {} });
});

/*
API Routes
*/
const { client } = require('./data-models');

app.use('/api', route);
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use('/api-docs/:params', (req,res,next) => {
    if(req.params.params === "modules"){
        SWAGGER_DOCS = swaggerdocumentmodule    
    }
    if(req.params.params === "clients"){
        SWAGGER_DOCS = swaggerDocument    
    }
    if(req.params.params === "logs"){
        SWAGGER_DOCS = swaggerdocumentlogs    
    }

    next();
}, swaggerUI.serve, swaggerUI.setup(swaggerdocumentlogs));
/*
Catch 404 Error
*/
app.use(async (req, res, next) => {
    res.status(404).send({ status: 404, message: "Invalid Route", data: {} });
});

/*
Error Handler
*/
app.use(async (err, req, res, next) => {
    const LogsModel = Models.logs;
    await new LogsModel({ message: err.message, stack: err.stack }).save();
    if (err.message == "jwt expired" || err.message == "invalid signature" || err.message == "No Auth") err.status = 401;
    const status = err.status || 400;
    if (typeof err == typeof "") { res.status(status).send({ status: status, message: err.message || err || "" }); }
    else res.status(status).send({ status: status, message: err.message || err.stack });
});

/*
Cron Tasks
*/
const clearLogs = cron.schedule('0 * * * *', async () => {
     controllers.admin.clearLogs();
});

clearLogs.start();
