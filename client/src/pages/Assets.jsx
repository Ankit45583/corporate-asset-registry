import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlineSearch, HiOutlineViewGrid, HiOutlineViewList } from "react-icons/hi";
import AssetTable from "../components/assets/AssetTable";
import AssetForm from "../components/assets/AssetForm";
import AssetDetails from "../components/assets/AssetDetails";
import { getAssets, createAsset, updateAsset, deleteAsset } from "../services/assetService";
import { ASSET_STATUS, ASSET_CATEGORIES, getCategoryIcon, formatCurrency } from "../utils/constants";
import toast from "react-hot-toast";
import "../styles/assets.css";

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [viewMode, setViewMode] = useState("table");
    const [showForm, setShowForm] = useState(false);
    const [editAsset, setEditAsset] = useState(null);
    const [viewAsset, setViewAsset] = useState(null);

    // ✅ Fetch assets from backend
    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const data = await getAssets();
            setAssets(data);
        } catch (error) {
            toast.error('Failed to load assets');
        } finally {
            setLoading(false);
        }
    };

    const filteredAssets = assets.filter(asset => {
        const matchSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
            asset.serialNumber.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || asset.status === statusFilter;
        const matchCategory = categoryFilter === "all" || asset.category === categoryFilter;
        return matchSearch && matchStatus && matchCategory;
    });

    const handleSave = async (assetData) => {
        try {
            if (editAsset) {
                const updated = await updateAsset(editAsset._id, assetData);
                setAssets(prev => prev.map(a => a._id === editAsset._id ? updated : a));
                toast.success('Asset updated!');
            } else {
                const created = await createAsset(assetData);
                setAssets(prev => [created, ...prev]);
                toast.success('Asset added!');
            }
            setShowForm(false);
            setEditAsset(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteAsset(id);
                setAssets(prev => prev.filter(a => a._id !== id));
                toast.success('Asset deleted!');
            } catch (error) {
                toast.error('Failed to delete asset');
            }
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            available: 'badge-success',
            assigned: 'badge-primary',
            maintenance: 'badge-warning',
            retired: 'badge-danger'
        };
        return map[status] || 'badge-gray';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading assets...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Assets</h1>
                    <p className="page-subtitle">
                        Manage all corporate assets • {filteredAssets.length} items
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditAsset(null); setShowForm(true); }}>
                    <HiOutlinePlus /> Add Asset
                </button>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <HiOutlineSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    {ASSET_STATUS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
                <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="all">All Categories</option>
                    {ASSET_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
                <div className="view-toggle">
                    <button className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
                        <HiOutlineViewList />
                    </button>
                    <button className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                        <HiOutlineViewGrid />
                    </button>
                </div>
            </div>

            {viewMode === 'table' ? (
                <div className="card">
                    <AssetTable
                        assets={filteredAssets}
                        onView={setViewAsset}
                        onEdit={(asset) => { setEditAsset(asset); setShowForm(true); }}
                        onDelete={handleDelete}
                    />
                </div>
            ) : (
                <div className="asset-grid">
                    {filteredAssets.map(asset => (
                        <div className="asset-card" key={asset._id}>
                            <div className="asset-card-top">
                                <div className={`asset-card-icon stat-icon ${asset.category === 'laptop' ? 'primary' : asset.category === 'phone' ? 'success' : 'warning'}`}>
                                    {getCategoryIcon(asset.category)}
                                </div>
                                <div className="asset-card-actions">
                                    <button className="asset-card-action" onClick={() => { setEditAsset(asset); setShowForm(true); }}>✏️</button>
                                    <button className="asset-card-action delete" onClick={() => handleDelete(asset._id)}>🗑️</button>
                                </div>
                            </div>
                            <div className="asset-card-body">
                                <h3 className="asset-card-name">{asset.name}</h3>
                                <p className="asset-card-id">{asset.serialNumber}</p>
                                <div className="asset-card-details">
                                    <div className="asset-card-detail">
                                        <span className="asset-card-detail-label">Cost</span>
                                        <span className="asset-card-detail-value">{formatCurrency(asset.cost)}</span>
                                    </div>
                                    <div className="asset-card-detail">
                                        <span className="asset-card-detail-label">Condition</span>
                                        <span className="asset-card-detail-value">{asset.condition}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="asset-card-footer">
                                <span className={`badge ${getStatusBadge(asset.status)}`}>{asset.status}</span>
                                <button className="btn btn-sm btn-outline" onClick={() => setViewAsset(asset)}>View</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <AssetForm
                    asset={editAsset}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditAsset(null); }}
                />
            )}
            {viewAsset && (
                <AssetDetails
                    asset={viewAsset}
                    onClose={() => setViewAsset(null)}
                />
            )}
        </div>
    );
};

export default Assets;