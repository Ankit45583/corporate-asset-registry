const express = require('express');
const router = express.Router();
const { 
    getEmployees, 
    getEmployee, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee 
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// ─── GET ALL + CREATE ──────────────────────────────────────
router.route('/')
    .get(protect, getEmployees)
    .post(protect, createEmployee);

// ─── GET ONE + UPDATE + DELETE ─────────────────────────────
router.route('/:id')
    .get(protect, getEmployee)
    .put(protect, updateEmployee)
    .delete(protect, deleteEmployee);

module.exports = router;