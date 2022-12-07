const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations');
const services = require('../services');
/*
On-Boarding
*/
router.post("/signup", services.fileUpload.FileUpload.single("profilePic"), validations.admin.validateSignup, controllers.admin.signup);
router.put('/profile', services.fileUpload.FileUpload.single("profilePic"), validations.admin.validateUpdateProfile, controllers.admin.updateProfile);


module.exports = router;