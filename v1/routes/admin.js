const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
/*
On-Boarding
*/
router.post("/signup", validations.admin.validateSignup, controllers.admin.signup);
router.post("/login", validations.admin.validateLogin, controllers.admin.login);
router.post("/logout", controllers.admin.logout);
router.post("/forgot/password", validations.admin.validateForgotPassword, controllers.admin.forgotPassword);
router.post("/reset/password", controllers.admin.resetPassword);
router.post("/change/password", validations.admin.isAdminValid, controllers.admin.changePassword);
router.get("/profile", validations.admin.isAdminValid, controllers.admin.getProfile);

/*
Client APIs
*/
router.post('/client', validations.admin.validateCreateCLient,controllers.admin.createClient);
router.get('/client',controllers.admin.getClient);
router.get('/client/:id',controllers.admin.getClientbyid);
router.put('/client/:id',controllers.admin.updateClient);
router.delete('/client/:id',controllers.admin.deleteClient);

router.post('./module',validations.admin.validateCreateModule,controllers.admin.createModule);



module.exports = router;