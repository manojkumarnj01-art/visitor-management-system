const express = require('express');
const router = express.Router();
const purchaseManualController = require('../controllers/purchaseManualController');

router.get('/', purchaseManualController.getPurchaseManuals);
router.post('/', purchaseManualController.createOrUpdatePurchaseManual);
router.put('/:id', purchaseManualController.updatePurchaseManual);
router.delete('/:id', purchaseManualController.deletePurchaseManual);

module.exports = router;
