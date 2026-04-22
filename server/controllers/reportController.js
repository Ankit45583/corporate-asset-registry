const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Assignment = require('../models/Assignment');

// GET dashboard summary
const getSummary = async (req, res) => {
    try {
        const totalAssets = await Asset.countDocuments();
        const totalEmployees = await Employee.countDocuments();
        const activeAssignments = await Assignment.countDocuments({ status: 'active' });

        const totalValue = await Asset.aggregate([
            { $group: { _id: null, total: { $sum: '$cost' } } }
        ]);

        const assetsByStatus = await Asset.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const assetsByCategory = await Asset.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 }, totalCost: { $sum: '$cost' } } }
        ]);

        res.json({
            totalAssets,
            totalEmployees,
            activeAssignments,
            totalValue: totalValue[0]?.total || 0,
            assetsByStatus,
            assetsByCategory
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET department breakdown
const getDepartmentReport = async (req, res) => {
    try {
        const report = await Employee.aggregate([
            {
                $group: {
                    _id: '$department',
                    employees: { $sum: 1 },
                    assets: { $sum: '$assetsCount' }
                }
            }
        ]);
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSummary, getDepartmentReport };