const joi = require('joi');
const config = require("config");
const DEVICE_TYPES = Object.values(config.get('DEVICE_TYPES'));

const validateSchema = async (schema, data) => {
    try {
        let validationResult = await schema.validate(data);
        if (validationResult.error) {
            let err = validationResult.error;
            throw err.details ? err.details[0].message.replace(/['"]+/g, '') : "";
        }
        return;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    validateCreateAdmin: async (data) => {
        try {
            let schema = joi.object().keys({
                userName: joi.string().min(5).max(50).required(),
                firstName: joi.string().min(3).max(50).required(),
                lastName: joi.string().min(3).max(50).required(),
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
                deviceType: joi.string().allow(...DEVICE_TYPES).optional(),
                deviceToken: joi.string().optional()
            });
            await validateSchema(schema, data);
        }
        catch (err) {
            throw err;
        }
    },
    validateCheckAdminExists: async (data) => {
        try {
            let schema = joi.object().keys({
                _id: joi.any().optional(),
                email: joi.string().trim().lowercase().optional(),
                phone: joi
                    .string()
                    .regex(/^[0-9]+$/)
                    .min(5)
                    .optional(),
                countryCode: joi
                    .string()
                    .regex(/^[0-9,+]+$/)
                    .trim()
                    .min(2)
                    .optional()
            });
            await validateSchema(schema, data);
        }
        catch (err) {
            throw err;
        }
    },
    validateUpdateAdmin: async (data) => {
        try {
            let schema = joi.object().keys({
                firstName: joi.string().min(3).max(50).optional(),
                lastName: joi.string().min(3).max(50).optional(),
                email: joi.string().trim().lowercase().optional(),
                phone: joi
                    .string()
                    .regex(/^[0-9]+$/)
                    .min(5)
                    .optional(),
                countryCode: joi
                    .string()
                    .regex(/^[0-9,+]+$/)
                    .trim()
                    .min(2)
                    .optional(),
                password: joi.string().min(3).max(50).optional(),
                address: joi.string().min(3).max(50).optional(),
                deviceType: joi.string().allow(...['IOS', 'ANDROID', 'WEB']).optional(),
                deviceToken: joi.string().optional()
            });
            await validateSchema(schema, data);
        }
        catch (err) {
            throw err;
        }
    },
    validateCreateCLient: async (data) => {
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
            await validateSchema(schema, data);
        } catch (err) {
            throw err;
        }

    },
    validatequeryClient: async (data) => {
        try {
            let schema = joi.object().keys({

                limit: joi
                    .string()
                    .regex(/^\d+$/)
                    .optional(),
                page: joi
                    .string()
                    .regex(/^[0-9,+]+$/)
                    .trim()
                    .optional(),
            });
            await validateSchema(schema, data);
        } catch (err) {
            throw err;
        }

    },
    updateCreateCLient: async (data) => {
        try {
            let schema = joi.object().keys({
                name: joi.string().min(3).max(100).optional(),
                description: joi.string().min(3).max(250).optional(),
                logo: joi.string().min(3).max(50).optional(),
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
                address: joi.string().min(3).max(150).optional(),
                lat: joi.string().min(3).max(50).optional(),
                lng: joi.string().min(3).max(50).optional(),
            });
            await validateSchema(schema, data);
        } catch (err) {
            throw err;
        }

    },
    validateCreateModule: async (data) => {
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
            await validateSchema(schema, data);
        } catch (err) {
            throw err;
        }

    },
    validateUpdateModule: async (data) => {
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
            await validateSchema(schema, data);
        } catch (err) {
            throw err;
        }

    }
};