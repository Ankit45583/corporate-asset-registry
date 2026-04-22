import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { getInitials, getAvatarColor, formatDate } from '../../utils/constants';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
    if (employees.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <div className="empty-state-title">No employees found</div>
                <div className="empty-state-text">Try adjusting your search or filters</div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Phone</th>
                        <th>Join Date</th>
                        <th>Assets</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp._id}>
                            <td>
                                <div className="employee-name-cell">
                                    <div className={`avatar ${getAvatarColor(emp.name)}`}>
                                        {getInitials(emp.name)}
                                    </div>
                                    <div className="employee-info">
                                        <h4>{emp.name}</h4>
                                        <span>{emp.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className="badge badge-primary">{emp.department}</span>
                            </td>
                            <td>{emp.designation}</td>
                            <td>{emp.phone}</td>
                            <td>{formatDate(emp.joinDate)}</td>
                            <td>
                                <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>
                                    {emp.assetsCount}
                                </span>
                            </td>
                            <td>
                                <span className={`badge ${emp.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                                    {emp.status}
                                </span>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button
                                        className="btn-icon btn-ghost btn-sm"
                                        onClick={() => onEdit(emp)}
                                        title="Edit"
                                    >
                                        <HiOutlinePencil />
                                    </button>
                                    <button
                                        className="btn-icon btn-ghost btn-sm"
                                        onClick={() => onDelete(emp._id)}
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

export default EmployeeTable;