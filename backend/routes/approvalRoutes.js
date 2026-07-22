const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');

router.get('/approve', approvalController.handleApproveLink);
router.get('/reject', approvalController.handleRejectLink);

module.exports = router;
