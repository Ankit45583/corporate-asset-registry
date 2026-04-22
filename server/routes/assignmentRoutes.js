const express = require('express');
const router = express.Router();
const {
    getAssignments,
    createAssignment,
    returnAsset,
    deleteAssignment
} = require('../controllers/assignmentController');

const Assignment = require('../models/Assignment'); // 👈 ADD THIS
const { protect } = require('../middleware/authMiddleware');

// 🔥 COUNT ROUTE (ACTIVE ONLY)
router.get('/count', protect, async (req, res) => {
    try {
        const count = await Assignment.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Existing routes
router.route('/')
    .get(protect, getAssignments)
    .post(protect, createAssignment);

router.route('/:id')
    .put(protect, returnAsset)
    .delete(protect, deleteAssignment);

module.exports = router;