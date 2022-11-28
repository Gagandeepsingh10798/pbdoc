const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
const services = require('../services');
/*
On-Boarding
*/
router.post("/signup", services.fileUpload.FileUpload.single("profilePic"), validations.admin.validateSignup, controllers.admin.signup);
router.post("/login", controllers.admin.login);
router.post("/logout", controllers.admin.logout);
router.post("/forgot/password", validations.admin.validateForgotPassword, controllers.admin.forgotPassword);
router.post("/reset/password", controllers.admin.resetPassword);
router.post("/change/password", controllers.admin.changePassword);
router.get("/profile", controllers.admin.getProfile);
router.put('/profile', services.fileUpload.FileUpload.single("profilePic"), validations.admin.validateUpdateProfile, controllers.admin.updateProfile);

// /*
// Module APIs
// */
// router.post('/module', validations.admin.isAdminValid, validations.admin.validateCreateModule, controllers.admin.createModule);
// router.get('/module', controllers.admin.getModule);
// router.get('/module/:id', validations.admin.isAdminValid, controllers.admin.getModulebyid);
// router.put('/module/:id', validations.admin.isAdminValid, validations.admin.validateUpdateModule, controllers.admin.updateModule);
// router.delete('/module/:id', validations.admin.isAdminValid, controllers.admin.deleteModule);

// /*
// Logs APIs
// */
// router.get('/logs', controllers.admin.getlogs);
// router.get('/logs/:logsId', controllers.admin.getSingleLog);
// router.delete('/logs', controllers.admin.deleteLogs);
// router.delete('/logs/:id', controllers.admin.deleteLog);


// router.post('/module/attach/:clientid', controllers.admin.attachtable);
// router.get('/modules/:clientid', controllers.admin.getattachtable);
// router.get('/module/clients/:moduleId', controllers.admin.getModuleAttach);
// router.put('/modules/detach/:clientid', controllers.admin.deletebyclientid);

/*
 Send Notification to Clients
*/
// router.post('/notify',controllers.admin.notification);
// router.post('/module/attach/:clientid', controllers.admin.attachtable);
// router.get('/modules/:clientid', controllers.admin.getattachtable);
// router.get('/module/clients/:moduleId', controllers.admin.getModuleAttach);
// router.put('/modules/detach/:clientid', controllers.admin.deletebyclientid);

module.exports = router;