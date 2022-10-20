const joi = require("joi");
const JOI_TO_SWAGGER = require('joi-to-swagger');
 
module.exports = [
    {
        route: "/api/v1/idp/user-settings/{key}",
        type: "post",
        tags: [
            "admin"
        ],
        summary: "API to add User Account",
        description: "API to add User Account",
        operationId: "adminvalidateSignup",
        joi_schema: {
            query: null,
            body: null,
            params: [{
                "name": "key",
                "in": "path",
                "description": "KEY of ID",
                "required": true,
                schema: JOI_TO_SWAGGER(joi.string().length(2).trim().required().example('gagan')).swagger
            }]
        },
        payload_ex: {
            query: "",
            body: "",
            params: [
                "XXXXX-XXXXX-XXXXX"
            ]
        },
        responses: {
            200: {
                description: "Success Response"
            }
        }
    }
];