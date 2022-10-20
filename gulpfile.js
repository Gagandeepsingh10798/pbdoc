const Gulp = require("gulp");
const IDP_V1_DOC = require('./swagger-doc/v1/idp/joi-schemas');
const fs = require('fs');

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