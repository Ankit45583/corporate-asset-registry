const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');

// GET all assignments
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate('asset', 'name category')
            .populate('employee', 'name email department');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create assignment
const createAssignment = async (req, res) => {
    try {
        const { asset, employee, assignDate, notes } = req.body;

        // Asset available check
        const assetDoc = await Asset.findById(asset);
        if (!assetDoc) return res.status(404).json({ message: 'Asset not found' });
        if (assetDoc.status !== 'available') {
            return res.status(400).json({ message: 'Asset is not available' });
        }

        // Create assignment
        const assignment = await Assignment.create({ asset, employee, assignDate, notes });

        // Update asset status
        await Asset.findByIdAndUpdate(asset, {
            status: 'assigned',
            assignedTo: employee
        });

        // Update employee assets count
        await Employee.findByIdAndUpdate(employee, {
            $inc: { assetsCount: 1 }
        });

        const populated = await Assignment.findById(assignment._id)
            .populate('asset', 'name category')
            .populate('employee', 'name email department');

        res.status(201).json(populated);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT return asset
const returnAsset = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        if (assignment.status === 'returned') {
            return res.status(400).json({ message: 'Asset already returned' });
        }

        // Update assignment
        assignment.status = 'returned';
        assignment.returnDate = Date.now();
        await assignment.save();

        // Update asset status
        await Asset.findByIdAndUpdate(assignment.asset, {
            status: 'available',
            assignedTo: null
        });

        // Update employee assets count
        await Employee.findByIdAndUpdate(assignment.employee, {
            $inc: { assetsCount: -1 }
        });

        res.json(assignment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE assignment
const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        res.json({ message: 'Assignment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAssignments, createAssignment, returnAsset, deleteAssignment };