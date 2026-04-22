import { useState, useEffect } from 'react';
import api from '../services/api'; // ✅ axios ki jagah api
import AssignAsset from '../components/assignments/AssignAsset';
import { HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Assignments = () => {
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // ✅ api use karo - token automatic lagega
            const assetRes = await api.get('/assets');
            const empRes = await api.get('/employees');
            const assignRes = await api.get('/assignments');

            // ✅ Sirf available assets
            const availableAssets = assetRes.data.filter(a => a.status === 'available');

            setAssets(availableAssets);
            setEmployees(empRes.data);
            setAssignments(assignRes.data);

        } catch (error) {
            console.error(error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        try {
            console.log('Sending assignment data:', data); // ✅ Debug

            // ✅ api use karo
            await api.post('/assignments', data);

            toast.success('Asset Assigned Successfully!');
            setShowModal(false);
            fetchData();

        } catch (error) {
            console.error('Assignment error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Error assigning asset');
        }
    };

    const handleReturn = async (id) => {
        try {
            await api.put(`/assignments/${id}`, { returnDate: new Date() });
            toast.success('Asset returned!');
            fetchData();
        } catch (error) {
            toast.error('Failed to return asset');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this assignment?')) {
            try {
                await api.delete(`/assignments/${id}`);
                toast.success('Assignment deleted!');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete assignment');
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading assignments...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Assignments</h1>
                    <p className="page-subtitle">
                        Manage asset assignments • {assignments.length} total
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    <HiOutlinePlus /> Assign Asset
                </button>
            </div>

            {/* Assignments Table */}
            <div className="card">
                {assignments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔗</div>
                        <div className="empty-state-title">No assignments yet</div>
                        <div className="empty-state-text">
                            Click "Assign Asset" to get started
                        </div>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>Employee</th>
                                    <th>Assign Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map((assignment) => (
                                    <tr key={assignment._id}>
                                        <td>{assignment.asset?.name || 'N/A'}</td>
                                        <td>{assignment.employee?.name || 'N/A'}</td>
                                        <td>
                                            {assignment.assignDate
                                                ? new Date(assignment.assignDate).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            <span className={`badge ${assignment.returnDate ? 'badge-success' : 'badge-primary'}`}>
                                                {assignment.returnDate ? 'Returned' : 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                {!assignment.returnDate && (
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => handleReturn(assignment._id)}
                                                    >
                                                        Return
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-icon btn-ghost btn-sm"
                                                    onClick={() => handleDelete(assignment._id)}
                                                    style={{ color: 'var(--danger)' }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <AssignAsset
                    assets={assets}
                    employees={employees}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Assignments;