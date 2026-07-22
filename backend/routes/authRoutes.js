const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.createOrUpdateSecurityUser);
router.get('/security-users', authController.getSecurityUsers);
router.get('/security-users/:id', authController.getSecurityUserById);
router.post('/security-users', authController.createOrUpdateSecurityUser);
router.delete('/security-users/:username', authController.deleteSecurityUser);

module.exports = router;
