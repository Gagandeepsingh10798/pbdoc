const joi = require('joi');
const universal = require('../../utils');
const config = require("config");
const DEVICE_TYPES = Object.values(config.get('DEVICE_TYPES'));
const { AdminDataManagement, ClientDataManagement } = require('../data-management');
const { MESSAGES } = require('../../constants');

const validateSchema = async (schema, data, next) => {
    try {
        let validationResult = await schema.validate(data);
        if (validationResult.error) {
            let err = validationResult.error;
            throw err.details ? err.details[0].message.replace(/['"]+/g, '') : "";
        }
        else next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    validateCreateModule: async (req, res, next) => {
        try {
            let schema = joi.object().keys({
                title: joi.string().min(3).max(100).required(),
                description: joi.string().min(3).max(250).required(),
                heading: joi.string().min(3).max(50).required(),
                subHeading: joi.string().trim().lowercase().required(),
                figmaLink: joi
                    .string()
                    .required(),
                bfDiagram: joi.string().required(),
                visFlow: joi.object().optional()
            });
            await validateSchema(schema, req.body, next);
        } catch (err) {
            throw err;
        }
    },
    validateUpdateModule: async (req, res, next) => {
        try {
            let schema = joi.object().keys({
                title: joi.string().min(3).max(100).optional(),
                description: joi.string().min(3).max(250).optional(),
                heading: joi.string().min(3).max(50).optional(),
                subHeading: joi.string().trim().lowercase().optional(),
                businessDocument: joi
                    .string()
                    .optional(),
                figmaLink: joi
                    .string()
                    .optional(),
                bfDiagram: joi.string().optional(),
                visFlow: joi.object().optional()

            });
            await validateSchema(schema, req.body, next);
        } catch (err) {
            throw err;
        }
    }
};