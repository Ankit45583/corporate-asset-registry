const Employee = require('../models/Employee');

// GET all employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .lean(); // ✅ faster
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single employee
const getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .lean(); // ✅ faster
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create employee
const createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        req.app.locals.cache.clear(); // ✅ Cache clear
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update employee
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        req.app.locals.cache.clear(); // ✅ Cache clear
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE employee
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        req.app.locals.cache.clear(); // ✅ Cache clear
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getEmployees, 
    getEmployee, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee 
};