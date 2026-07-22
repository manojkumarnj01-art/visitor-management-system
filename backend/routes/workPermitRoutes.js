const express = require('express');
const router = express.Router();
const workPermitController = require('../controllers/workPermitController');

router.get('/', workPermitController.getAllWorkPermits);
router.get('/:id', workPermitController.getWorkPermitById);
router.post('/', workPermitController.createOrUpdateWorkPermit);
router.put('/:id', workPermitController.updateWorkPermit);
router.delete('/:id', workPermitController.deleteWorkPermit);

module.exports = router;
