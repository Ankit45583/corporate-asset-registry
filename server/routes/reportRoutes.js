const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Assignment = require('../models/Assignment');
const { protect } = require('../middleware/authMiddleware');

// ─── GET /api/reports/summary ──────────────────────────────
router.get('/summary', protect, async (req, res) => {
    try {
        const assets = await Asset.find();
        const employees = await Employee.find();

        // ✅ Assignment populate karo taaki asset/employee name mile
        const assignments = await Assignment.find()
            .populate('asset', 'name category cost status')
            .populate('employee', 'name department');

        // ─── Basic Stats ───────────────────────────────────
        const totalAssets = assets.length;
        const totalEmployees = employees.length;
        const totalAssignments = assignments.length;

        // ✅ Active assignments - returnDate nahi hai matlab active
        const activeAssignments = assignments.filter(
            (a) => !a.returnDate
        ).length;

        // ─── Value ────────────────────────────────────────
        const totalValue = assets.reduce(
            (sum, a) => sum + (a.cost || a.price || 0),
            0
        );
        const avgValue = totalAssets > 0 ? totalValue / totalAssets : 0;

        // ─── Status counts ────────────────────────────────
        const assignedCount = assets.filter(
            (a) => a.status === 'assigned'
        ).length;
        const availableCount = assets.filter(
            (a) => a.status === 'available'
        ).length;
        const maintenanceCount = assets.filter(
            (a) => a.status === 'maintenance'
        ).length;
        const retiredCount = assets.filter(
            (a) => a.status === 'retired'
        ).length;

        // ─── Utilization Rate ─────────────────────────────
        const utilizationRate =
            totalAssets > 0
                ? ((assignedCount / totalAssets) * 100).toFixed(1)
                : '0.0';

        // ─── Category Data ────────────────────────────────
        const categoryData = {};
        assets.forEach((asset) => {
            const cat = asset.category || 'other';
            categoryData[cat] = (categoryData[cat] || 0) + 1;
        });

        // ─── Monthly Data - Last 6 Months ─────────────────
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.toLocaleString('default', {
                month: 'short',
            });
            const year = date.getFullYear();
            const monthNum = date.getMonth();

            // ✅ purchaseDate ya createdAt dono check karo
            const monthAssets = assets.filter((a) => {
                const dateToCheck = a.purchaseDate || a.createdAt;
                if (!dateToCheck) return false;
                const d = new Date(dateToCheck);
                return (
                    d.getMonth() === monthNum &&
                    d.getFullYear() === year
                );
            });

            // ✅ assignDate ya createdAt dono check karo
            const monthAssignments = assignments.filter((a) => {
                const dateToCheck = a.assignDate || a.createdAt;
                if (!dateToCheck) return false;
                const d = new Date(dateToCheck);
                return (
                    d.getMonth() === monthNum &&
                    d.getFullYear() === year
                );
            });

            const assetCount = monthAssets.length;
            const cost = monthAssets.reduce(
                (sum, a) => sum + (a.cost || a.price || 0),
                0
            );
            const assigned = monthAssignments.length;
            const available = monthAssets.filter(
                (a) => a.status === 'available'
            ).length;

            monthlyData.push({
                month,
                assets: assetCount,
                cost,
                assigned,
                available,
            });
        }

        // ─── Recent Activity ───────────────────────────────
        const recentActivity = [];

        // Latest assignments (last 3)
        const recentAssignments = [...assignments]
            .sort(
                (a, b) =>
                    new Date(b.assignDate || b.createdAt) -
                    new Date(a.assignDate || a.createdAt)
            )
            .slice(0, 3);

        recentAssignments.forEach((assign) => {
            recentActivity.push({
                text: `<strong>${
                    assign.asset?.name || 'Asset'
                }</strong> assigned to ${
                    assign.employee?.name || 'Employee'
                }`,
                time: getTimeAgo(assign.assignDate || assign.createdAt),
                type: 'primary',
            });
        });

        // Maintenance assets
        assets
            .filter((a) => a.status === 'maintenance')
            .slice(0, 2)
            .forEach((asset) => {
                recentActivity.push({
                    text: `<strong>${asset.name}</strong> sent for maintenance`,
                    time: getTimeAgo(
                        asset.updatedAt || asset.createdAt
                    ),
                    type: 'warning',
                });
            });

        // Retired assets
        assets
            .filter((a) => a.status === 'retired')
            .slice(0, 1)
            .forEach((asset) => {
                recentActivity.push({
                    text: `<strong>${asset.name}</strong> marked as retired`,
                    time: getTimeAgo(
                        asset.updatedAt || asset.createdAt
                    ),
                    type: 'danger',
                });
            });

        // New employees (last 2)
        const recentEmployees = [...employees]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
            )
            .slice(0, 2);

        recentEmployees.forEach((emp) => {
            recentActivity.push({
                text: `<strong>${emp.name}</strong> added to system`,
                time: getTimeAgo(emp.createdAt),
                type: 'success',
            });
        });

        res.json({
            totalAssets,
            totalEmployees,
            totalAssignments,
            activeAssignments,   // ✅ Correct field
            assignedCount,
            availableCount,
            maintenanceCount,
            retiredCount,
            totalValue,
            avgValue,
            utilizationRate,
            categoryData,
            monthlyData,
            recentActivity: recentActivity.slice(0, 5),
        });
    } catch (err) {
        console.error('Summary error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ─── GET /api/reports/departments ─────────────────────────
router.get('/departments', protect, async (req, res) => {
    try {
        const employees = await Employee.find();

        // ✅ Assignments se asset count nikalo
        const assignments = await Assignment.find()
            .populate('employee', 'department');

        const deptMap = {};

        employees.forEach((emp) => {
            const dept = emp.department || 'Unknown';
            if (!deptMap[dept]) {
                deptMap[dept] = { employees: 0, assets: 0 };
            }
            deptMap[dept].employees += 1;
        });

        // ✅ Assignment se asset count
        assignments.forEach((assign) => {
            const dept =
                assign.employee?.department || 'Unknown';
            if (!deptMap[dept]) {
                deptMap[dept] = { employees: 0, assets: 0 };
            }
            deptMap[dept].assets += 1;
        });

        const result = Object.entries(deptMap).map(
            ([department, data]) => ({
                department,
                employees: data.employees,
                assets: data.assets,
                avgPerEmployee:
                    data.employees > 0
                        ? (data.assets / data.employees).toFixed(1)
                        : '0',
            })
        );

        res.json(result);
    } catch (err) {
        console.error('Department report error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ─── Helper: Time ago ──────────────────────────────────────
const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800)
        return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString('en-IN');
};

module.exports = router;