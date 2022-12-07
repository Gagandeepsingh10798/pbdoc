const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
/*
On-Boarding
*/
router.post("/login", controllers.onboarding.login);
router.post("/logout", controllers.onboarding.logout);
router.post("/forgot/password", validations.admin.validateForgotPassword, controllers.onboarding.forgotPassword);
router.post("/reset/password", controllers.onboarding.resetPassword);
router.post("/change/password", controllers.onboarding.changePassword);
router.get("/profile", controllers.onboarding.getProfile);

module.exports = router;