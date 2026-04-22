const express = require('express');
const router = express.Router();
const {
    getAssets,
    getAsset,
    createAsset,
    updateAsset,
    deleteAsset
} = require('../controllers/assetController');

const Asset = require('../models/Asset'); // 👈 ADD THIS
const { protect } = require('../middleware/authMiddleware');

// 🔥 COUNT ROUTE (ADD THIS ABOVE "/:id")
router.get('/count', protect, async (req, res) => {
    try {
        const count = await Asset.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Existing routes
router.route('/')
    .get(protect, getAssets)
    .post(protect, createAsset);

router.route('/:id')
    .get(protect, getAsset)
    .put(protect, updateAsset)
    .delete(protect, deleteAsset);


module.exports = router;