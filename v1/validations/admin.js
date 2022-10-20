const joi = require('joi');
const universal = require('../../utils');
const { AdminDataManagement ,ClientDataManagement} = require('../data-management');
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
    validateSignup: async (req, res, next) => {
        try {
            let schema = joi.object().keys({
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
                deviceType: joi.string().allow(...['IOS', 'ANDROID', 'WEB']).optional(),
                deviceToken: joi.string().optional()
            });
            await validateSchema(schema, req.body, next);
        }
        catch (err) {
            throw err;
        }
    },
    validateLogin: async (req, res, next) => {
        try {
            let schema = joi.object().keys({
                email: joi.string().trim().lowercase().required(),
                password: joi.string().min(3).max(50).required(),
                deviceType: joi.string().allow(...['IOS', 'ANDROID', 'WEB']).optional(),
                deviceToken: joi.string().optional()
            });
            await validateSchema(schema, req.body, next);
        }
        catch (err) {
            throw err;
        }
    },
    validateForgotPassword: async (req, res, next) => {
        try {
            let schema = joi.object().keys({
                email: joi.string().trim().lowercase().required()
            });
            await validateSchema(schema, req.body, next);
        }
        catch (err) {
            throw err;
        }
    },
    validateCreateCLient: async (req, res, next) => {
        try{
        let schema = joi.object().keys({
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
        });
        await validateSchema(schema, req.body, next);
    }catch(err)
    {
        throw err;  
    }
    },
    isAdminValid: async (req, res, next) => {
        try {
            if (req.headers.authorization) {
                let authToken = req.headers.authorization;
                let decodedToken = await universal.verifyAuthToken(authToken);
                let AdminModel = new AdminDataManagement();
                req.user = await AdminModel.checkAdminExists({ _id: decodedToken._id }, true);
                next();
            }
            else {
                throw new Error(MESSAGES.admin.AUTHORIZATION_IS_MISSING);
            }
        }
        catch (error) {
            next(error);
        }

    },
    validateCreateModule: async (req, res, next) => {
        try{
        let schema = joi.object().keys({
            title: joi.string().min(3).max(100).required(),
            description: joi.string().min(3).max(250).required(),
            logo: joi.string().min(3).max(50).required(),
            heading: joi.string().min(3).max(50).required(),
            subHeading: joi.string().trim().lowercase().required(),
            businessDocument: joi
                .string()
                .required(),
            figmaLink: joi
                .string()
                .required(),
            bfDiagram: joi.string().optional()
        });
        await validateSchema(schema, req.body, next);
    }catch(err)
    {
        throw err;  
    }
    }

};