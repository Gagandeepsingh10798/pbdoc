/* 
Import Required Modules
*/
const config = require('config');
const http = require("http");
const cors = require("cors");
const morgan = require('morgan');
const express = require("express");
const path=require("path");
const Models = require("./data-models");
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const controllers = require('./v1/controllers');
const { MESSAGES } = require("./constants");
var cron = require('node-cron');
const swaggerDocument = require('./swagger-doc/v1/client/swagger.json');

const app = express();
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
mongoose.connect(config.get('DB_URL'), { useNewUrlParser: true, useUnifiedTopology: true }).then(
    (db) => console.log(`****************************************** MONGODB CONNECTED ***********************************************`),
    (err) => console.log("MongoDB " + String(err.message))
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
const route = require('./route');

app.use('/api', route);

/*
Swagger setup
*/


const task=cron.schedule('0 * * * *', async () => {
    controllers.admin.deleteerror();
});

task.start();


app.use('/api-docs/client', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/uploads', express.static(path.join(__dirname, 'public')));

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
    await new LogsModel({ message: err.message,stack:err.stack }).save();
    if (err.message == "jwt expired" || err.message == "invalid signature" || err.message == "No Auth") err.status = 401;
    const status = err.status || 400;
    if (typeof err == typeof "") { res.status(status).send({ status: status, message: err.message || err || "" }); }
    else res.status(status).send({ status: status, message: err.message || err.stack });
});