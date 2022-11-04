const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
const {upload} = require('../multer/multer');
/*
On-Boarding
*/
router.post("/signup",upload.single("user_file"),validations.admin.validateSignup, controllers.admin.signup);
router.post("/login", validations.admin.validateLogin, controllers.admin.login);
router.post("/logout", controllers.admin.logout);
router.post("/forgot/password", validations.admin.validateForgotPassword, controllers.admin.forgotPassword);
router.post("/reset/password", controllers.admin.resetPassword); 
router.post("/change/password", validations.admin.isAdminValid, controllers.admin.changePassword);
router.get("/profile", controllers.admin.getProfile);
router.get('/signup',controllers.admin.getAdmin);
router.put('/profile/:id',upload.single("user_file"),controllers.admin.updateProfile);
/*
Client APIs
*/
router.post('/client',validations.admin.isAdminValid,validations.admin.validateCreateCLient,controllers.admin.createClient);
router.get('/client',controllers.admin.getClient);
router.get('/client/:id',validations.admin.isAdminValid,controllers.admin.getClientbyid);
router.put('/client/:id',validations.admin.isAdminValid,validations.admin.updateCreateCLient,controllers.admin.updateClient);
router.delete('/client/:id',validations.admin.isAdminValid,controllers.admin.deleteClient);

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
router.post('/:clientid/attach',controllers.admin.attachtable);
router.get('/attach',controllers.admin.getattachtable);

module.exports = router;