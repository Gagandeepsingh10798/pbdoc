const Gulp = require("gulp");
const IDP_V1_DOC = require('./swagger-doc/v1/idp/joi-schemas');
const fs = require('fs');
const clients = require("./swagger-doc/v1/client/index");
const modules = require('./swagger-doc/v1/module/index');
const logs = require("./swagger-doc/v1/logs/index");

Gulp.task('build-doc:v1/logs',function(){
    const LOGS_PATHS ={

    };
    for(var i=0;i<logs.length;i++)
    {
        let route = logs[i].route;
        if(LOGS_PATHS[route] == undefined)
        {
            LOGS_PATHS[route] ={};
        }
        LOGS_PATHS[route][`${logs[i].type}`] ={"tags":logs[i].tags,
    "summary":logs[i].summary,
"description":logs[i].description,};
if(logs[i].joi_schema.params){
    LOGS_PATHS[route][`${logs[i].type}`].parameters = logs[i].joi_schema.params;
}
if(logs[i].joi_schema.body){
    LOGS_PATHS[route][`${logs[i].type}`].requestBody = logs[i].joi_schema.body;
}

    }
    let LOGS_SWAGGER = require('./swagger-doc/v1/swagger.json')
   LOGS_SWAGGER.paths = LOGS_PATHS;
    fs.writeFile("./swagger-doc/v1/logs/swagger.json", JSON.stringify(LOGS_SWAGGER), err => {
        if (err) throw err;
        console.log("Done writing"); // Success
    });
})
Gulp.task('build-doc:v1/module',function(){
    const MODULE_PATHS ={

    };
    for(var i=0;i<modules.length;i++)
    {
        let route = modules[i].route;
        if(MODULE_PATHS[route] == undefined)
        {
            MODULE_PATHS[route] ={};
        }
        MODULE_PATHS[route][`${modules[i].type}`] ={"tags":modules[i].tags,
    "summary":modules[i].summary,
"description":modules[i].description,};
if(modules[i].joi_schema.params){
    MODULE_PATHS[route][`${modules[i].type}`].parameters = modules[i].joi_schema.params;
}
if(modules[i].joi_schema.body){
    MODULE_PATHS[route][`${modules[i].type}`].requestBody = modules[i].joi_schema.body;
}

    }
    let MODULE_SWAGGER = require('./swagger-doc/v1/module/swagger.json')
    MODULE_SWAGGER.paths = MODULE_PATHS;
    fs.writeFile("./swagger-doc/v1/module/swagger.json", JSON.stringify(MODULE_SWAGGER), err => {
        if (err) throw err;
        console.log("Done writing"); // Success
    });
})
Gulp.task('build-doc:v1/idp', function () {
    const IDP_PATHS = {

    };
    for (var i = 0; i < IDP_V1_DOC.length; i++) {
        let route = IDP_V1_DOC[i].route;
        IDP_PATHS[route] = {};
        IDP_PATHS[route][`${IDP_V1_DOC[i].type}`] = {
            "tags": IDP_V1_DOC[i].tags,
            "summary": IDP_V1_DOC[i].summary,
            "description": IDP_V1_DOC[i].description,
            "operationId": IDP_V1_DOC[i].operationId,
        };
        if (IDP_V1_DOC[i].joi_schema.params) {
            IDP_PATHS[route][`${IDP_V1_DOC[i].type}`].parameters = IDP_V1_DOC[i].joi_schema.params;
        }
        if(IDP_V1_DOC[i].joi_schema.body){
            // IDP_PATHS[route][`${IDP_V1_DOC[i].type}`].requestBody ={};

            IDP_PATHS[route][`${IDP_V1_DOC[i].type}`].requestBody = IDP_V1_DOC[i].joi_schema.body;

        }
        if (IDP_V1_DOC[i].joi_schema.query) {
            IDP_PATHS[route][`${IDP_V1_DOC[i].type}`].parameters = IDP_V1_DOC[i].joi_schema.query;
         
        }
        if (IDP_V1_DOC[i].responses) {
            IDP_PATHS[route][`${IDP_V1_DOC[i].type}`].responses = IDP_V1_DOC[i].responses;
        }
        
        if (IDP_V1_DOC[i].payload_ex.params) {
            for (var j = 0; j < IDP_V1_DOC[i].payload_ex.params.length; j++) {
                IDP_PATHS[route][`${IDP_V1_DOC[i].type}`].parameters[j].example = IDP_V1_DOC[i].payload_ex.params[j];
            }
        }
        // if (IDP_V1_DOC[i].payload_ex.body) {
        //     // for (var j = 0; j < IDP_V1_DOC[i].payload_ex.params.length; j++) {
        //     //     IDP_PATHS[route][`${IDP_V1_DOC[i].type}`].example = IDP_V1_DOC[i].payload_ex.body[j];
        //     // }
           
        //     IDP_PATHS[route][`${IDP_V1_DOC[i].type}`].requestBody = IDP_V1_DOC[i].payload_ex.body;
        //     // IDP_PATHS[route][`${IDP_V1_DOC[i].type}`].requestBody.example = IDP_V1_DOC[i].payload_ex.body;
        // }

        
       
    }
    let IDP_SWAGGER = require('./swagger-doc/v1/idp/swagger.json');
    IDP_SWAGGER.paths = IDP_PATHS;
    fs.writeFile("./swagger-doc/v1/idp/swagger.json", JSON.stringify(IDP_SWAGGER), err => {
        if (err) throw err;
        console.log("Done writing"); // Success
    });
});


Gulp.task('buildoc:v1/client',function(){
    const CLIENT_PATHS = {

    };
    for (var i = 0; i < clients.length; i++) {
        let route = clients[i].route;
        if(CLIENT_PATHS[route] == undefined){
        CLIENT_PATHS[route] = {};}

        CLIENT_PATHS[route][`${clients[i].type}`] = {
            "tags": clients[i].tags,
            "summary": clients[i].summary,
            "description": clients[i].description,
           
        };
        if (clients[i].joi_schema.params) {
            CLIENT_PATHS[route][`${clients[i].type}`].parameters = clients[i].joi_schema.params;
        }
        if(clients[i].joi_schema.headers)
        {
            CLIENT_PATHS[route][`${clients[i].type}`].parameters = clients[i].joi_schema.headers;   
        }
        if(clients[i].joi_schema.body){
            CLIENT_PATHS[route][`${clients[i].type}`].requestBody = clients[i].joi_schema.body;

        }
        if (clients[i].joi_schema.query) {
            CLIENT_PATHS[route][`${clients[i].type}`].parameters = clients[i].joi_schema.query;
         
        }
        if (clients[i].responses) {
            CLIENT_PATHS[route][`${clients[i].type}`].responses = clients[i].responses;
        }
    }
    let CLIENT_SWAGGER = require('./swagger-doc/v1/client/swagger.json')
    CLIENT_SWAGGER.paths = CLIENT_PATHS;
    fs.writeFile("./swagger-doc/v1/client/swagger.json", JSON.stringify(CLIENT_SWAGGER), err => {
        if (err) throw err;
        console.log("Done writing"); // Success
    });
});