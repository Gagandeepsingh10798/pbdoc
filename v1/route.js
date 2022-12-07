const router = require('express').Router();
const Routes = require('./routes');
router.use('/admin', Routes.admin);
router.use('/client', Routes.client);
router.use('/module', Routes.module);
router.use('/onboarding', Routes.onboarding);
module.exports = router;