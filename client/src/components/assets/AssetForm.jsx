import { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { ASSET_CATEGORIES, ASSET_STATUS } from '../../utils/constants';

const AssetForm = ({ asset, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'laptop',
        serialNumber: '',
        status: 'available',
        cost: '',
        purchaseDate: '',
        condition: 'Excellent',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (asset) {
            setFormData({
                name: asset.name || '',
                category: asset.category || 'laptop',
                serialNumber: asset.serialNumber || '',
                status: asset.status || 'available',
                cost: asset.cost || '',
                purchaseDate: asset.purchaseDate || '',
                condition: asset.condition || 'Excellent',
                notes: asset.notes || ''
            });
        }
    }, [asset]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Asset name is required';
        if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Serial number is required';
        if (!formData.cost || formData.cost <= 0) newErrors.cost = 'Valid cost is required';
        if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                ...formData,
                cost: Number(formData.cost),
                id: asset?.id || `AST-${String(Date.now()).slice(-3)}`
            });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">
                        {asset ? '✏️ Edit Asset' : '➕ Add New Asset'}
                    </h3>
                    <button className="modal-close" onClick={onClose}>
                        <HiOutlineX />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Asset Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. MacBook Pro 16 inch"
                                />
                                {errors.name && <div className="form-error">{errors.name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    {ASSET_CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.icon} {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Serial Number <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-input ${errors.serialNumber ? 'error' : ''}`}
                                    name="serialNumber"
                                    value={formData.serialNumber}
                                    onChange={handleChange}
                                    placeholder="e.g. SN-2024-001"
                                />
                                {errors.serialNumber && <div className="form-error">{errors.serialNumber}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    {ASSET_STATUS.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Cost (₹) <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    className={`form-input ${errors.cost ? 'error' : ''}`}
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    placeholder="e.g. 150000"
                                />
                                {errors.cost && <div className="form-error">{errors.cost}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Purchase Date <span className="required">*</span>
                                </label>
                                <input
                                    type="date"
                                    className={`form-input ${errors.purchaseDate ? 'error' : ''}`}
                                    name="purchaseDate"
                                    value={formData.purchaseDate}
                                    onChange={handleChange}
                                />
                                {errors.purchaseDate && <div className="form-error">{errors.purchaseDate}</div>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Condition</label>
                            <select
                                className="form-select"
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                            >
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-textarea"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Any additional notes..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {asset ? 'Update Asset' : 'Add Asset'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssetForm;