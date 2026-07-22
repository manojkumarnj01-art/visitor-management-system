const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

router.get('/', visitorController.getAllVisitors);
router.get('/:id', visitorController.getVisitorById);
router.post('/', visitorController.createVisitor);
router.put('/:id', visitorController.updateVisitor);
router.put('/:id/checkin', visitorController.checkInVisitor);
router.put('/:id/checkout', visitorController.checkOutVisitor);
router.delete('/:id', visitorController.deleteVisitor);

module.exports = router;
