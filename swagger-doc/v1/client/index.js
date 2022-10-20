const joi = require("joi");
const JOI_TO_SWAGGER = require('joi-to-swagger');
module.exports = [
    {
        route: "/api/v1/document/client/{id}",
        type: "delete",
        tags: [
            "client"
        ],
        summary: "API to delete client by id",
        description: "API to delete client by id",
        // operationId: "adminvalidateSignup",
        joi_schema: {
            query: null,
            params: [{
                "name": "id",
                "in": "path",
                "description": "KEY of ID",
                "required": true,
                schema: JOI_TO_SWAGGER(joi.string().length(2).trim().required()).swagger
            }],
            body: null,
        },
        // payload_ex: {
        //     query: "",
        //     body: null,
        //     params: {
        //         id: "2",
        //     }
          
        // },
        responses: {
        }
    }, 
    {
        route: "/api/v1/document/client",
        type: "get",
        tags: [
            "client"
        ],
        summary: "API to create new client using get request",
        description: "API to create new client using get request",
        joi_schema: {
            query: null,
            params: null,
            headers: {
                "content": {
                    "application/json":{
                        "name":"authorization",
                        "in": "headers",
                        schema :  JOI_TO_SWAGGER( joi.object().keys({
                            "authorization": joi.object().keys({
                                "token": joi.string().required(),
                                "refreshToken":joi.string().required(),
                            })
                     } ) )}
            }},
            body: 

            {
                "content": {
                    "application/json": {
                "name":"body",
                "in": "body",
                schema :  JOI_TO_SWAGGER( joi.object().keys({
                    name: joi.string().min(3).max(100).required(),
                    description: joi.string().min(3).max(250).required(),
                    logo: joi.string().min(3).max(50).required(),
                    domain: joi.string().min(3).max(50).required(),
                    email: joi.string().trim().lowercase().required(),
                    phone: joi
                        .string()
                        .regex(/^\d+$/)
                        .min(5)
                        .required(),
                    countryCode: joi
                        .string()
                        .regex(/^[0-9,+]+$/)
                        .trim()
                        .min(2)
                        .required(),
                    address: joi.string().min(3).max(150).required(),
                    lat: joi.string().min(3).max(50).required(),
                    lng: joi.string().min(3).max(50).required(),
                
                })).swagger
               
            }}}
        },
        payload_ex: {
            query: "",
            body:{
                email:"demo@patientbond.com",
               Password:"XXXXXXXXXX",
                name: "chirag",
                phone:"7073757492",
                countryCode: "+91",
                address: "SGNR"

            },
            params: null
          
        },
        responses: {
        }
    },
    {
        route: "/api/v1/document/client",
        type: "post",
        tags: [
            "client"
        ],
        summary: "API to create new client",
        description: "API to create new client",
        // operationId: "adminvalidateSignup",
        joi_schema: {
            query: null,
            params: null,
            headers: {
                "content": {
                    "application/json":{
                        "name":"authorization",
                        "in": "headers",
                        schema :  JOI_TO_SWAGGER( joi.object().keys({
                            "authorization": joi.object().keys({
                                "token": joi.string().required(),
                                "refreshToken":joi.string().required(),
                            })
                     } ) )}
            }},
            body: 

            {
                "content": {
                    "application/json": {
                "name":"body",
                "in": "body",
                schema: JOI_TO_SWAGGER( joi.object().keys({
                    name: joi.string().min(3).max(100).required(),
                    description: joi.string().min(3).max(250).required(),
                    logo: joi.string().min(3).max(50).required(),
                    domain: joi.string().min(3).max(50).required(),
                    email: joi.string().trim().lowercase().required(),
                    phone: joi
                        .string()
                        .regex(/^\d+$/)
                        .min(5)
                        .required(),
                    countryCode: joi
                        .string()
                        .regex(/^[0-9,+]+$/)
                        .trim()
                        .min(2)
                        .required(),
                    address: joi.string().min(3).max(150).required(),
                    lat: joi.string().min(3).max(50).required(),
                    lng: joi.string().min(3).max(50).required(),
                
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
    },
    {
        route: "/api/v1/document/client/{id}",
        type: "get",
        tags: [
            "client"
        ],
        summary: "API to get client by id",
        description: "API to get client by id",
        // operationId: "adminvalidateSignup",
        joi_schema: {
            query: null,
            params: [{
                "name": "id",
                "in": "path",
                "description": "KEY of ID",
                "required": true,
                schema: JOI_TO_SWAGGER(joi.string().length(2).trim().required()).swagger
            }],
            body: null
        },
        payload_ex: {
            query: "",
            body: null,
            params: {
                id: "2",
            }
          
        },
        responses: {
        }
    },
    {
        route: "/api/v1/document/client/{id}",
        type: "put",
        tags: [
            "client"
        ],
        summary: "API to update client by id",
        description: "API to update client by id",
        // operationId: "adminvalidateSignup",
        joi_schema: {
            query: null,
            params: [{
                "name": "id",
                "in": "path",
                "description": "KEY of ID",
                "required": true,
                schema: JOI_TO_SWAGGER(joi.string().length(2).trim().required()).swagger
            }],
            body: 

            {
                "content": {
                    "application/json": {
                "name":"body",
                "in": "body",
                schema: JOI_TO_SWAGGER( joi.object().keys({
                    name: joi.string().min(3).max(100).required(),
                    description: joi.string().min(3).max(250).required(),
                    logo: joi.string().min(3).max(50).required(),
                    domain: joi.string().min(3).max(50).required(),
                    email: joi.string().trim().lowercase().required(),
                    phone: joi
                        .string()
                        .regex(/^\d+$/)
                        .min(5)
                        .required(),
                    countryCode: joi
                        .string()
                        .regex(/^[0-9,+]+$/)
                        .trim()
                        .min(2)
                        .required(),
                    address: joi.string().min(3).max(150).required(),
                    lat: joi.string().min(3).max(50).required(),
                    lng: joi.string().min(3).max(50).required(),
                
                })).swagger
               
            }}}
        },
        responses: {
        }
    }
];