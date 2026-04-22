import { HiOutlineX } from 'react-icons/hi';
import { getCategoryIcon, formatCurrency, formatDate, SAMPLE_EMPLOYEES } from '../../utils/constants';

const AssetDetails = ({ asset, onClose }) => {
    const assignedEmployee = SAMPLE_EMPLOYEES.find(e => e.id === asset.assignedTo);

    const getStatusBadge = (status) => {
        const map = {
            available: 'badge-success',
            assigned: 'badge-primary',
            maintenance: 'badge-warning',
            retired: 'badge-danger'
        };
        return map[status] || 'badge-gray';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Asset Details</h3>
                    <button className="modal-close" onClick={onClose}>
                        <HiOutlineX />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="asset-detail-header">
                        <div className="asset-detail-icon">
                            {getCategoryIcon(asset.category)}
                        </div>
                        <div className="asset-detail-title">
                            <h3>{asset.name}</h3>
                            <span>{asset.id} • {asset.serialNumber}</span>
                        </div>
                        <span className={`badge ${getStatusBadge(asset.status)}`} style={{ marginLeft: 'auto' }}>
                            {asset.status}
                        </span>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <div className="detail-item-label">Category</div>
                            <div className="detail-item-value" style={{ textTransform: 'capitalize' }}>
                                {getCategoryIcon(asset.category)} {asset.category}
                            </div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-item-label">Cost</div>
                            <div className="detail-item-value">{formatCurrency(asset.cost)}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-item-label">Purchase Date</div>
                            <div className="detail-item-value">{formatDate(asset.purchaseDate)}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-item-label">Condition</div>
                            <div className="detail-item-value">{asset.condition}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-item-label">Serial Number</div>
                            <div className="detail-item-value" style={{ fontFamily: 'monospace' }}>
                                {asset.serialNumber}
                            </div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-item-label">Assigned To</div>
                            <div className="detail-item-value">
                                {assignedEmployee ? assignedEmployee.name : 'Not Assigned'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default AssetDetails;