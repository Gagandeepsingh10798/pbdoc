const router = require("express").Router();
const controllers = require('../controllers');
/*
Logs APIs
*/
router.get('/', controllers.logs.getAllLogs);
module.exports = router;