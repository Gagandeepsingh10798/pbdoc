const joi = require('joi');
const config = require("config");
const DEVICE_TYPES = Object.values(config.get('DEVICE_TYPES'));

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
    validateSignup: async (req, res, next) => {
        try {
            let schema = joi.object().keys({
                userName: joi.string().min(5).max(50).required(),
                name: joi.string().min(3).max(100).required(),
                description: joi.string().min(3).max(250).required(),
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
                password: joi.string().min(3).max(50).required(),
                address: joi.string().min(3).max(50).required(),
                lat: joi.string().min(2).required(),
                lng: joi.string().min(2).required(),
            });
            await validateSchema(schema, req.body, next);
        } catch (err) {
            throw err;
        }
    },
    updateClientById: async (req, res, next) => {
        try {
            let schema = joi.object().keys({
                name: joi.string().min(3).max(100).optional(),
                description: joi.string().min(3).max(250).optional(),
                domain: joi.string().min(3).max(50).optional(),
                email: joi.string().trim().lowercase().optional(),
                phone: joi
                    .string()
                    .regex(/^\d+$/)
                    .min(5)
                    .optional(),
                countryCode: joi
                    .string()
                    .regex(/^[0-9,+]+$/)
                    .trim()
                    .min(2)
                    .optional(),
                address: joi.string().min(3).max(50).optional(),
                lat: joi.string().min(2).optional(),
                lng: joi.string().min(2).optional(),
            });
            await validateSchema(schema, req.body, next);
        } catch (err) {
            throw err;
        }
    },
};