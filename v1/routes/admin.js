const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
const permission = require("../permission/permission");
const Apipermission = require("../../data-models/Apipermission");
const { CLIENTS_NOT_EXIST } = require("../../langs/en");
/*
On-Boarding
*/
router.post("/signup", validations.admin.validateSignup, controllers.admin.signup);
router.post("/login", validations.admin.validateLogin, permission.checkpermission,controllers.admin.login);
router.post("/logout", controllers.admin.logout);
router.post("/forgot/password", validations.admin.validateForgotPassword,permission.checkpermission, controllers.admin.forgotPassword);
router.post("/reset/password" ,controllers.admin.resetPassword);
router.post("/change/password", validations.admin.isAdminValid,permission.checkpermission, controllers.admin.changePassword);
router.get("/profile", validations.admin.isAdminValid,permission.checkpermission, controllers.admin.getProfile);

/*
Client APIs
*/
router.post('/client',validations.admin.isAdminValid,permission.checkpermission,validations.admin.validateCreateCLient,controllers.admin.createClient);
router.get('/client',validations.admin.isAdminValid,permission.checkpermission,controllers.admin.getClient);
router.get('/client/:id',validations.admin.isAdminValid,permission.checkpermission,controllers.admin.getClientbyid);
router.put('/client/:id',validations.admin.isAdminValid,permission.checkpermission,validations.admin.updateCreateCLient,controllers.admin.updateClient);
router.delete('/client/:id',validations.admin.isAdminValid,permission.checkpermission,controllers.admin.deleteClient);
//  Adding path to db

console.log(Apipermission.find());
/*
Module APIs
*/
router.post('/module',validations.admin.isAdminValid,validations.admin.validateCreateModule,controllers.admin.createModule);
router.get('/module',validations.admin.isAdminValid,controllers.admin.getModule);
router.get('/module/:id',validations.admin.isAdminValid,controllers.admin.getModulebyid);
router.put('/module/:id',validations.admin.isAdminValid,validations.admin.validateUpdateModule,controllers.admin.updateModule);
router.delete('/module/:id',validations.admin.isAdminValid,controllers.admin.deleteModule);


router.get('/logs',controllers.admin.getlogs);
router.delete('/logs',controllers.admin.deleteLogs);

module.exports = router;