const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');

// GET all assignments
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate('asset', 'name category')
            .populate('employee', 'name email department')
            .lean(); // ✅ faster
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
        const assetDoc = await Asset.findById(asset).lean(); // ✅ lean
        if (!assetDoc) return res.status(404).json({ message: 'Asset not found' });
        if (assetDoc.status !== 'available') {
            return res.status(400).json({ message: 'Asset is not available' });
        }

        // ✅ Parallel karo - 3 operations ek saath
        const [assignment] = await Promise.all([
            Assignment.create({ asset, employee, assignDate, notes }),
            Asset.findByIdAndUpdate(asset, {
                status: 'assigned',
                assignedTo: employee
            }),
            Employee.findByIdAndUpdate(employee, {
                $inc: { assetsCount: 1 }
            })
        ]);

        // Populate karke return karo
        const populated = await Assignment.findById(assignment._id)
            .populate('asset', 'name category')
            .populate('employee', 'name email department')
            .lean(); // ✅ lean

        // ✅ Cache clear
        req.app.locals.cache.clear();

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
        if (assignment.returnDate) {
            return res.status(400).json({ message: 'Asset already returned' });
        }

        // ✅ Parallel karo - 3 operations ek saath
        await Promise.all([
            Assignment.findByIdAndUpdate(req.params.id, {
                returnDate: Date.now(),
            }),
            Asset.findByIdAndUpdate(assignment.asset, {
                status: 'available',
                assignedTo: null
            }),
            Employee.findByIdAndUpdate(assignment.employee, {
                $inc: { assetsCount: -1 }
            })
        ]);

        // ✅ Cache clear
        req.app.locals.cache.clear();

        res.json({ message: 'Asset returned successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE assignment
const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        // ✅ Cache clear
        req.app.locals.cache.clear();

        res.json({ message: 'Assignment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getAssignments, 
    createAssignment, 
    returnAsset, 
    deleteAssignment 
};