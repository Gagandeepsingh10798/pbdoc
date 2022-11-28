const router = require('express').Router();
const Routes = require('./routes');
router.use('/admin', Routes.admin);
router.use('/client', Routes.client);
module.exports = router;