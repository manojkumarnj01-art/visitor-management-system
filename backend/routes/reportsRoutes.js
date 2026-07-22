const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/visitors', reportsController.getVisitorReports);
router.get('/departments', reportsController.getDepartmentAnalytics);

module.exports = router;
