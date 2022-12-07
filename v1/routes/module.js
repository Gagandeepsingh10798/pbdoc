const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
const services = require('../services');
/*
Modules APIs
*/
router.post('/signup', services.fileUpload.FileUpload.single("businessDocument"), validations.module.validateCreateModule, controllers.module.createModule);
router.get('/', controllers.module.getModule);
router.get('/info', controllers.module.getModuleById);
router.put('/info', services.fileUpload.FileUpload.single("businessDocument"), controllers.module.updateModule);

module.exports = router;