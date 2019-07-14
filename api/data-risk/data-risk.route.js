const router = require('express').Router();
const { getRiskMeterData, getAllStatisticsDashboardData } = require('./data-risk.controller');

/**
 * risk data route
 */
router.get('/risk-meter-data', getRiskMeterData);
router.get('/dashboard-data', getAllStatisticsDashboardData);


module.exports = router;
