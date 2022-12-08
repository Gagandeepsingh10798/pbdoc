const config = require('config');
const http = require("http");
const cors = require("cors");
const morgan = require('morgan');
const express = require("express");
const path = require("path");
const Models = require("./data-models");
const mongoose = require('mongoose');
const controllers = require('./v1/controllers');
const cron = require('node-cron');
const universal = require('./utils');
const route = require('./route');
const app = express();
app.use(cors());

/*
Initialize Server
*/
let server = http.createServer(app);
server.listen(config.get('PORT'), async () => {
    try {
        console.log(`****************************************** ${'ENVIRONMENT:::' + process.env.NODE_ENV} *******************************************************`);
        console.log(`****************************************** ${'PORT:::' + config.get('PORT')} *******************************************************`);
        /*
        Database Connection
        */
        await mongoose.connect(config.get('DB_URL'), { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`****************************************** MONGODB CONNECTED ***********************************************`);
    }
    catch (err) {
        console.log(`************************* MONGODB CONNECTION ERROR *********************************`);
        console.log(err);
    }

});


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
app.use((req, res, next) => {
    universal.validateApiPermissions(req, res, next)
});
/*
Static Paths
*/
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

/*
Test API
*/
app.use('/test', async (req, res, next) => {
    res.status(200).send({ status: 200, message: "TEST API", data: {} });
});

/*
API Routes
*/
app.use('/api', route);

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
    console.log(err);
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
// const clearLogs = cron.schedule('0 * * * *', async () => {
//     controllers.admin.clearLogs();
// });

// clearLogs.start();
