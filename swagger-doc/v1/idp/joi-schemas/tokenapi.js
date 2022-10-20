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
        route: "/api/v1/idp/oauth2-token",
        type: "post",
        tags: [
            "admin"
        ],
        summary: "API to add User Account",
        description: "API to add User Account",
        operationId: "adminvalidateSignup",
        joi_schema: {
            query: null,
            body: 

                {
                    "content": {
                        "application/json": {
                    "name": "body",
                    "in": "body",
                    "description": "Body ",
                     
                    schema: JOI_TO_SWAGGER(joi.object().keys({
                redirect_uri: joi.string().optional(),
                enableSms2FA: joi.boolean().valid(true,false),
                grant_type : joi.string().optional(),
                widgetType : joi.string().optional(),
                widgetTypeId: joi.string().optional(),
                password:joi.string().optional().allow(null,"","undefined"),
                client_id:joi.string().required(),
                timeout_duration:joi.string().regex(Regex.number).required(),
                username:joi.string().required(),
                access_token_interval:joi.string().required(),
                confirmed_new_login:joi.string().optional()
            })).swagger,
            example:{redirect_uri:"https://goodle.com",
                    enableSms2FA:"true/false",
                    // grant_type : "ddd",
                    //     widgetType :"dd" ,
                    //     widgetTypeId:"ccc",
                    //     password:"xxxxx",
                    //     client_id:"eeeee",
                    //     timeout_duration:"ddd",
                    //     username:"dd",
                    //     access_token_interval:"d",
                    //     confirmed_new_login:'ddd'
                     }
        }
    }
},
            params: null
        },
        payload_ex: {
            query: "",
            params: null,
            body: {redirect_uri:"https://goodle.com",
            enableSms2FA:"true/false",
            // grant_type : "ddd",
            //     widgetType :"dd" ,
            //     widgetTypeId:"ccc",
            //     password:"xxxxx",
            //     client_id:"eeeee",
            //     timeout_duration:"ddd",
            //     username:"dd",
            //     access_token_interval:"d",
            //     confirmed_new_login:'ddd'
             }
        },
        responses: {
            500: {
                
            }
        }
    }
];
