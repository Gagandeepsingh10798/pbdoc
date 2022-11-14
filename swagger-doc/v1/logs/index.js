const joi = require("joi");
const JOI_TO_SWAGGER = require('joi-to-swagger');
module.exports=[
    {
        route: '/api/v1/document/logs',
        type: "get",
        tags: [
            "logs"
        ],
        summary: "API to get logs",
        description: "API to get logs",
        // operationId: "adminvalidateSignup",
        joi_schema: {
            query: null,
            params: null,
            body: null,
        },
        responses: {
        }  
    },
 
    {
        route: '/api/v1/document/logs',
        type: "delete",
        tags: [
            "logs"
        ],
        summary: "API to delete logs",
        description: "API to delete logs",
        // operationId: "adminvalidateSignup",
        joi_schema: {
            query: null,
            params: null,
            body: null,
        },
        responses: {
        }  
    }
]