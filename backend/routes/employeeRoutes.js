const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getAllEmployees);
router.get('/code/:code', employeeController.getEmployeeByCode);
router.get('/:id', employeeController.getEmployeeByCode);
router.post('/', employeeController.createOrUpdateEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/code/:code', employeeController.deleteEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
