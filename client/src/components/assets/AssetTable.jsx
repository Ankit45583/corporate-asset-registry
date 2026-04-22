import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { getCategoryIcon, formatCurrency, formatDate } from '../../utils/constants';

const AssetTable = ({ assets, onView, onEdit, onDelete }) => {
    const getCategoryBg = (category) => {
        const colors = {
            laptop: 'primary', desktop: 'info', monitor: 'accent',
            phone: 'success', tablet: 'warning', printer: 'danger',
            chair: 'warning', desk: 'primary', projector: 'info',
            vehicle: 'success', other: 'gray'
        };
        return colors[category] || 'primary';
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

    if (assets.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <div className="empty-state-title">No assets found</div>
                <div className="empty-state-text">Try adjusting your search or filters</div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Category</th>
                        <th>Serial No.</th>
                        <th>Status</th>
                        <th>Cost</th>
                        <th>Purchase Date</th>
                        <th>Condition</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map((asset, index) => (
                        <tr key={asset._id} style={{ animationDelay: `${index * 0.05}s` }}>
                            <td>
                                <div className="asset-name-cell">
                                    <div className={`asset-name-icon stat-icon ${getCategoryBg(asset.category)}`}>
                                        {getCategoryIcon(asset.category)}
                                    </div>
                                    <div className="asset-name-info">
                                        <h4>{asset.name}</h4>
                                        <span>{asset._id}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>
                                    {asset.category}
                                </span>
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                                {asset.serialNumber}
                            </td>
                            <td>
                                <span className={`badge ${getStatusBadge(asset.status)}`}>
                                    {asset.status}
                                </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>
                                {formatCurrency(asset.cost)}
                            </td>
                            <td>{formatDate(asset.purchaseDate)}</td>
                            <td>{asset.condition}</td>
                            <td>
                                <div className="table-actions">
                                    <button
                                        className="btn-icon btn-ghost btn-sm"
                                        onClick={() => onView(asset)}
                                        title="View"
                                    >
                                        <HiOutlineEye />
                                    </button>
                                    <button
                                        className="btn-icon btn-ghost btn-sm"
                                        onClick={() => onEdit(asset)}
                                        title="Edit"
                                    >
                                        <HiOutlinePencil />
                                    </button>
                                    <button
                                        className="btn-icon btn-ghost btn-sm"
                                        onClick={() => onDelete(asset._id)}
                                        title="Delete"
                                        style={{ color: 'var(--danger)' }}
                                    >
                                        <HiOutlineTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssetTable;