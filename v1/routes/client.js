const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
const services = require('../services');
/*
Client APIs
*/
router.post('/signup', services.fileUpload.FileUpload.single("logo"), validations.client.validateSignup, controllers.client.createClient);
router.get('/', controllers.client.getClients);
router.put('/', services.fileUpload.FileUpload.single("logo"), validations.client.updateClientById, controllers.client.updateClientById);
router.put('/profile', services.fileUpload.FileUpload.single("logo"), validations.client.updateClientById, controllers.client.updateClientByClient);
router.post('/attach/modules', controllers.client.attachModules);
router.get('/attach/modules', controllers.client.getAttachedModules);
module.exports = router;