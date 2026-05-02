const express = require('express');
const router = express.Router();
const {
    getAssets,
    getAsset,
    createAsset,
    updateAsset,
    deleteAsset
} = require('../controllers/assetController');

const Asset = require('../models/Asset');
const { protect } = require('../middleware/authMiddleware');

// ─── COUNT ROUTE ───────────────────────────────────────────
router.get('/count', protect, async (req, res) => {
    try {
        const count = await Asset.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ─── GET ALL + CREATE ──────────────────────────────────────
router.route('/')
    .get(protect, getAssets)
    .post(protect, async (req, res) => {
        try {
            const asset = await createAsset(req, res);
            // ✅ Cache clear karo
            req.app.locals.cache.clear();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

// ─── GET ONE + UPDATE + DELETE ─────────────────────────────
router.route('/:id')
    .get(protect, getAsset)
    .put(protect, async (req, res) => {
        try {
            await updateAsset(req, res);
            // ✅ Cache clear karo
            req.app.locals.cache.clear();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .delete(protect, async (req, res) => {
        try {
            await deleteAsset(req, res);
            // ✅ Cache clear karo
            req.app.locals.cache.clear();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

module.exports = router;