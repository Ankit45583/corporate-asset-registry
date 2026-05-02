const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Assignment = require('../models/Assignment');
const { protect } = require('../middleware/authMiddleware');

// ─── GET /api/reports/summary ──────────────────────────────
router.get('/summary', protect, async (req, res) => {
    try {

        // ✅ FIX 1: Sab queries PARALLEL chalao - Promise.all
        // Pehle: Sequential tha = Query1 + Query2 + Query3 ka time
        // Ab: Parallel = sirf sabse slow query ka time
        const [
            totalAssets,
            totalEmployees,
            activeAssignments,
            valueResult,
            statusCounts,
            categoryResult,
            recentAssignments,
            maintenanceAssets,
            retiredAssets,
            recentEmployees,
            monthlyAssets,
            monthlyAssignments,
        ] = await Promise.all([

            // ✅ FIX 2: countDocuments use karo - find() mat karo
            // Pehle: Asset.find() = poora data load
            // Ab: sirf count return hoga
            Asset.countDocuments(),
            Employee.countDocuments(),
            Assignment.countDocuments({ returnDate: null }),

            // ✅ FIX 3: Aggregation DB me karo - JS me nahi
            // Total value
            Asset.aggregate([
                { $group: { _id: null, total: { $sum: '$cost' } } }
            ]),

            // ✅ Status counts - ek hi aggregation se sab
            // Pehle: 4 alag filter JS me
            // Ab: 1 DB query se sab
            Asset.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Category data
            Asset.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // ✅ FIX 4: Sirf zaruri fields lo - populate kam karo
            // Recent assignments - sirf 3 chahiye
            Assignment.find({ returnDate: null })
                .sort({ createdAt: -1 })
                .limit(3)
                .populate('asset', 'name')        // sirf name
                .populate('employee', 'name')      // sirf name
                .lean(),                           // ✅ lean() = faster

            // Maintenance assets - sirf 2
            Asset.find({ status: 'maintenance' })
                .select('name updatedAt createdAt')  // sirf ye fields
                .sort({ updatedAt: -1 })
                .limit(2)
                .lean(),

            // Retired assets - sirf 1
            Asset.find({ status: 'retired' })
                .select('name updatedAt createdAt')
                .sort({ updatedAt: -1 })
                .limit(1)
                .lean(),

            // Recent employees - sirf 2
            Employee.find()
                .select('name createdAt')
                .sort({ createdAt: -1 })
                .limit(2)
                .lean(),

            // ✅ FIX 5: Monthly data DB se lo - JS loop nahi
            // Last 6 months assets
            Asset.aggregate([
                {
                    $match: {
                        $or: [
                            { purchaseDate: { 
                                $gte: new Date(
                                    new Date().setMonth(
                                        new Date().getMonth() - 6
                                    )
                                ) 
                            }},
                            { createdAt: { 
                                $gte: new Date(
                                    new Date().setMonth(
                                        new Date().getMonth() - 6
                                    )
                                ) 
                            }}
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            month: {
                                $month: {
                                    $ifNull: ['$purchaseDate', '$createdAt']
                                }
                            },
                            year: {
                                $year: {
                                    $ifNull: ['$purchaseDate', '$createdAt']
                                }
                            }
                        },
                        count: { $sum: 1 },
                        cost: { $sum: { $ifNull: ['$cost', 0] } },
                        available: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$status', 'available'] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ]),

            // Last 6 months assignments
            Assignment.aggregate([
                {
                    $match: {
                        $or: [
                            { assignDate: { 
                                $gte: new Date(
                                    new Date().setMonth(
                                        new Date().getMonth() - 6
                                    )
                                ) 
                            }},
                            { createdAt: { 
                                $gte: new Date(
                                    new Date().setMonth(
                                        new Date().getMonth() - 6
                                    )
                                ) 
                            }}
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            month: {
                                $month: {
                                    $ifNull: ['$assignDate', '$createdAt']
                                }
                            },
                            year: {
                                $year: {
                                    $ifNull: ['$assignDate', '$createdAt']
                                }
                            }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
        ]);

        // ─── Process Status Counts ─────────────────────────
        // DB se aaya grouped result process karo
        const statusMap = {};
        statusCounts.forEach(s => {
            statusMap[s._id] = s.count;
        });

        const assignedCount    = statusMap['assigned']    || 0;
        const availableCount   = statusMap['available']   || 0;
        const maintenanceCount = statusMap['maintenance'] || 0;
        const retiredCount     = statusMap['retired']     || 0;

        // ─── Process Category Data ─────────────────────────
        const categoryData = {};
        categoryResult.forEach(c => {
            if (c._id) categoryData[c._id] = c.count;
        });

        // ─── Process Monthly Data ──────────────────────────
        const monthNames = [
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
        ];

        // Asset monthly map
        const assetMonthMap = {};
        monthlyAssets.forEach(item => {
            const key = `${item._id.year}-${item._id.month}`;
            assetMonthMap[key] = {
                count: item.count,
                cost: item.cost,
                available: item.available
            };
        });

        // Assignment monthly map
        const assignMonthMap = {};
        monthlyAssignments.forEach(item => {
            const key = `${item._id.year}-${item._id.month}`;
            assignMonthMap[key] = item.count;
        });

        // Build last 6 months array
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = monthNames[date.getMonth()];
            const year  = date.getFullYear();
            const key   = `${year}-${date.getMonth() + 1}`;

            const assetInfo = assetMonthMap[key] || {
                count: 0, cost: 0, available: 0
            };

            monthlyData.push({
                month,
                assets:    assetInfo.count,
                cost:      assetInfo.cost,
                assigned:  assignMonthMap[key] || 0,
                available: assetInfo.available,
            });
        }

        // ─── Build Recent Activity ─────────────────────────
        const recentActivity = [];

        recentAssignments.forEach(assign => {
            recentActivity.push({
                text: `<strong>${assign.asset?.name || 'Asset'}</strong> assigned to ${assign.employee?.name || 'Employee'}`,
                time: getTimeAgo(assign.assignDate || assign.createdAt),
                type: 'primary',
            });
        });

        maintenanceAssets.forEach(asset => {
            recentActivity.push({
                text: `<strong>${asset.name}</strong> sent for maintenance`,
                time: getTimeAgo(asset.updatedAt || asset.createdAt),
                type: 'warning',
            });
        });

        retiredAssets.forEach(asset => {
            recentActivity.push({
                text: `<strong>${asset.name}</strong> marked as retired`,
                time: getTimeAgo(asset.updatedAt || asset.createdAt),
                type: 'danger',
            });
        });

        recentEmployees.forEach(emp => {
            recentActivity.push({
                text: `<strong>${emp.name}</strong> added to system`,
                time: getTimeAgo(emp.createdAt),
                type: 'success',
            });
        });

        // ─── Final Response ────────────────────────────────
        const totalValue      = valueResult[0]?.total || 0;
        const utilizationRate = totalAssets > 0
            ? ((assignedCount / totalAssets) * 100).toFixed(1)
            : '0.0';

        res.json({
            totalAssets,
            totalEmployees,
            totalAssignments:  totalAssets,
            activeAssignments,
            assignedCount,
            availableCount,
            maintenanceCount,
            retiredCount,
            totalValue,
            avgValue: totalAssets > 0 ? totalValue / totalAssets : 0,
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

        // ✅ FIX: Parallel + aggregation DB me
        const [deptEmployees, deptAssets] = await Promise.all([

            Employee.aggregate([
                {
                    $group: {
                        _id: '$department',
                        employees: { $sum: 1 }
                    }
                }
            ]),

            Assignment.aggregate([
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'emp'
                    }
                },
                { $unwind: '$emp' },
                {
                    $group: {
                        _id: '$emp.department',
                        assets: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Merge results
        const deptMap = {};

        deptEmployees.forEach(d => {
            deptMap[d._id || 'Unknown'] = {
                employees: d.employees,
                assets: 0
            };
        });

        deptAssets.forEach(d => {
            const dept = d._id || 'Unknown';
            if (!deptMap[dept]) {
                deptMap[dept] = { employees: 0, assets: 0 };
            }
            deptMap[dept].assets = d.assets;
        });

        const result = Object.entries(deptMap).map(
            ([department, data]) => ({
                department,
                employees: data.employees,
                assets:    data.assets,
                avgPerEmployee: data.employees > 0
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
    const now  = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60)     return 'Just now';
    if (diff < 3600)   return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString('en-IN');
};

module.exports = router;