const joi = require("joi");
const JOI_TO_SWAGGER = require('joi-to-swagger');
module.exports = [
    {
        route: "/api/v1/idp/change-password-api",
        type: "post",
        tags: [
            "admin"
        ],
        summary: "API to Change User password",
        description: "API to Change User password",
        operationId: "adminvalidateSignup",
        joi_schema: {
            query: null,
            params: null,
            body: 

            {
                "content": {
                    "application/json": {
                "name":"body",
                "in": "body",
                schema: JOI_TO_SWAGGER( joi.object().keys({
                    emailAddress: joi.string().regex(/^([A-Za-z0-9_\-\.\!\#\$\%\^\&\Z*\(\)\{\}\|\:\;\?\><\`\~\=\+\{\}<\>'\''])+\@(([A-Za-z0-9-])+\.){1,20}([A-Za-z]{2,6})$/).required(),
                    oldPassword:  joi.string().required(),
                    passwordSettings:joi.object().keys({
                        numberOfPasswordTracked:joi.string().regex(/^[0-9]*$/).required(),
                        maximumPasswordAgeEnforced : joi.boolean().valid(true,false).required(),
                        minimumPasswordAgeEnforced :joi.boolean().valid(true,false).required(),
                        maximumPasswordAgeDurationInDays:joi.string().regex(/^[0-9]*$/).required(),
                        minimumPasswordAgeDurationInDays:joi.string().regex(/^[0-9]*$/).required()
                    }),
                    newPassword: joi.string().required()
                
                })).swagger
               
            }}}
        },
        payload_ex: {
            query: "",
            body:{
                email:"demo@patientbond.com",
                oldPassword:"XXXXXXXXXX",
                newPassword:"xxxxxxxxxx"

            },
            params: null
          
        },
        responses: {
        }
    }
];