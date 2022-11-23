const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
const Models=require("../../data-models");
const VisModel=Models.vis;
// const permission = require("../permission/permission");
// const Apipermission = require("../../data-models/Apipermission");
// const { CLIENTS_NOT_EXIST } = require("../../langs/en");
const {upload} = require('../multer/multer');
const { models } = require("mongoose");
/*
On-Boarding
*/
router.post("/signup",upload.single("user_file"),validations.admin.validateSignup,controllers.admin.signup);
router.post("/login", validations.admin.validateLogin,controllers.admin.login);
router.post("/logout", controllers.admin.logout);
router.post("/forgot/password", validations.admin.validateForgotPassword, controllers.admin.forgotPassword);
router.post("/reset/password" ,controllers.admin.resetPassword);
router.post("/change/password", validations.admin.isAdminValid, controllers.admin.changePassword);
router.get("/profile", validations.admin.isAdminValid, controllers.admin.getProfile);
router.put('/profile',validations.admin.isAdminValid,upload.single("profilePic"),controllers.admin.updateProfile);
/*
Client APIs
*/
router.post('/client',validations.admin.validateCreateCLient,controllers.admin.createClient);
router.get('/client',controllers.admin.getClient);
router.get('/client/:id',controllers.admin.getClientbyid);
router.put('/client/:id',validations.admin.isAdminValid,validations.admin.updateCreateCLient,controllers.admin.updateClient);
router.delete('/client/:id',controllers.admin.deleteClient);

/*
Module APIs
*/
router.post('/module',validations.admin.validateCreateModule,controllers.admin.createModule);
router.get('/module',controllers.admin.getModule);
router.get('/module/:id',controllers.admin.getModulebyid);
router.put('/module/:id',validations.admin.validateUpdateModule,controllers.admin.updateModule);
router.delete('/module/:id',controllers.admin.deleteModule);

/*
Logs APIs
*/
router.get('/logs',controllers.admin.getlogs);
router.get('/logs/:logsId',controllers.admin.getSingleLog);
router.delete('/logs',controllers.admin.deleteLogs);
router.delete('/logs/:id',controllers.admin.deleteLog);


router.post('/module/attach/:clientid',controllers.admin.attachtable);
router.get('/modules/:clientid',controllers.admin.getattachtable);
router.get('/module/clients/:moduleId',controllers.admin.getModuleAttach);
router.put('/modules/detach/:clientid',controllers.admin.deletebyclientid);
/*
Store Api's to database
*/
router.get('/apis',controllers.admin.getAllApi);
router.post('/permissions',controllers.admin.addPermission);
router.get('/permissions',controllers.admin.getPermissionsByUserType);
router.delete('/permissions',controllers.admin.deletePermissions);
/*
 Send Notification to Clients
*/
router.post('/notify',controllers.admin.notification);

module.exports = router;