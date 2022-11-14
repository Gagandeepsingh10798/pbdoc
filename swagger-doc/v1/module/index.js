const joi = require("joi");
const JOI_TO_SWAGGER = require('joi-to-swagger');
module.exports =[{
  route: '/api/v1/document/module',
  type: "post",
  tags: [
      "module"
  ],
  summary: "API to create module",
  description: "API to create module",
  // operationId: "adminvalidateSignup",
  joi_schema: {
      query: null,
      params: null,
      body: 
      {
          "content": {
              "application/json": {
          "name":"body",
          "in": "body",
          schema :  JOI_TO_SWAGGER( joi.object().keys({
            title: joi.string().min(3).max(100).required(),
            description: joi.string().min(3).max(250).required(),
            heading: joi.string().min(3).max(50).required(),
            subHeading: joi.string().trim().lowercase().required(),
            businessDocument: joi
                .string()
                .required(),
            figmaLink: joi
                .string()
                .required(),
            bfDiagram: joi.string().required(),
            visFlow:joi.string().required()

          
          })).swagger}}},
  },
  responses: {
  }

},{
    route: '/api/v1/document/module',
    type: "get",
    tags: [
        "module"
    ],
    summary: "API to get module",
    description: "API to get module",
    // operationId: "adminvalidateSignup",
    joi_schema: {
        query: null,
        params: null,
        body: null,
    },
    responses: {
    }
  
},{
    route: '/api/v1/document/module/{id}',
    type: "get",
    tags: [
        "module"
    ],
    summary: "API to get module by id",
    description: "API to get module by id",
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
    responses: {
    }  
},
{
    route: '/api/v1/document/module/{id}',
    type: "put",
    tags: [
        "module"
    ],
    summary: "API to update module by id",
    description: "API to update module by id",
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
            schema :  JOI_TO_SWAGGER( joi.object().keys({
              title: joi.string().min(3).max(100).required(),
              description: joi.string().min(3).max(250).required(),
              heading: joi.string().min(3).max(50).required(),
              subHeading: joi.string().trim().lowercase().required(),
              businessDocument: joi
                  .string()
                  .required(),
              figmaLink: joi
                  .string()
                  .required(),
              bfDiagram: joi.string().required(),
              visFlow:joi.string().required()
  
            
            })).swagger}}},
        
    },
    responses: {
    }  },{
        route: '/api/v1/document/module/{id}',
        type: "delete",
        tags: [
            "module"
        ],
        summary: "API to delete module by id",
        description: "API to delete module by id",
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
        responses: {
        }  
    }
]