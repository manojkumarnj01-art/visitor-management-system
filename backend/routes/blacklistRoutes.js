const express = require('express');
const router = express.Router();
const blacklistController = require('../controllers/blacklistController');

router.get('/', blacklistController.getBlacklist);
router.post('/', blacklistController.addToBlacklist);
router.delete('/:phone', blacklistController.removeFromBlacklist);

module.exports = router;
