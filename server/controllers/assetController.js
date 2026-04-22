const Asset = require('../models/Asset');

// GET all assets
const getAssets = async (req, res) => {
    try {
        const assets = await Asset.find().populate('assignedTo', 'name email');
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single asset
const getAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id).populate('assignedTo', 'name email');
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create asset
const createAsset = async (req, res) => {
    try {
        const asset = await Asset.create(req.body);
        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update asset
const updateAsset = async (req, res) => {
    try {
        const asset = await Asset.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE asset
const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        res.json({ message: 'Asset deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAssets, getAsset, createAsset, updateAsset, deleteAsset };