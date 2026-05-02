const express = require('express');
const router = express.Router();
const {
    getAssignments,
    createAssignment,
    returnAsset,
    deleteAssignment
} = require('../controllers/assignmentController');

const Assignment = require('../models/Assignment');
const { protect } = require('../middleware/authMiddleware');

// ─── COUNT ROUTE ───────────────────────────────────────────
router.get('/count', protect, async (req, res) => {
    try {
        // ✅ Active assignments count - returnDate null matlab active
        const count = await Assignment.countDocuments({ 
            returnDate: null 
        });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ─── GET ALL + CREATE ──────────────────────────────────────
router.route('/')
    .get(protect, getAssignments)
    .post(protect, createAssignment);

// ─── RETURN + DELETE ───────────────────────────────────────
router.route('/:id')
    .put(protect, returnAsset)
    .delete(protect, deleteAssignment);

module.exports = router;