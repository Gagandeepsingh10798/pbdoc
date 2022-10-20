const joi = require("joi");
const JOI_TO_SWAGGER = require('joi-to-swagger');
var Regex = {
    number: /^[0-9]*$/,
    email: /^([A-Za-z0-9_\-\.\!\#\$\%\^\&\Z*\(\)\{\}\|\:\;\?\><\`\~\=\+\{\}<\>'\''])+\@(([A-Za-z0-9-])+\.){1,20}([A-Za-z]{2,6})$/,
    phone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    dateTime: /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9].[0-9][0-9][0-9][0-9][0-9][0-9]/g
};

module.exports = [
    {
        route: "/api/v1/idp/send-sms-2fa-otp-api/send-otp",
        type: "post",
        tags: [
            "admin"
        ],
        summary: "API to Send Otp",
        description: "API to Send Otp",
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
                    userName: joi.string().required(),
                    toNumber : joi.string().regex(Regex.phone).required()
                })).swagger
               
            }}}
        },
        payload_ex: {
            query: "",
            body:{
                userName:"Gaurav",
                toNumber:"XXXXXXXXXX"

            },
            params: null
        },
        responses: {
        }
    }
];