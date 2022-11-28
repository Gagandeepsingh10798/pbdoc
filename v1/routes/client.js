const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
const services = require('../services');
/*
Client APIs
*/
router.post('/', services.fileUpload.FileUpload.single("logo"), validations.client.validateSignup, controllers.client.createClient);
router.get('/', controllers.client.getClients);
router.get('/:id', controllers.client.getClientById);
router.put('/:id', services.fileUpload.FileUpload.single("logo"), validations.client.updateClientById, controllers.client.updateClientById);

module.exports = router;