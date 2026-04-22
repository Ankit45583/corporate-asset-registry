import { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { DEPARTMENTS } from '../../utils/constants';

const EmployeeForm = ({ employee, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: 'Engineering',
        designation: '',
        phone: '',
        joinDate: '',
        status: 'active'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                department: employee.department || 'Engineering',
                designation: employee.designation || '',
                phone: employee.phone || '',
                joinDate: employee.joinDate || '',
                status: employee.status || 'active'
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
        if (!formData.joinDate) newErrors.joinDate = 'Join date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                ...formData,
                id: employee?.id || `EMP-${String(Date.now()).slice(-3)}`,
                assetsCount: employee?.assetsCount || 0
            });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">
                        {employee ? '✏️ Edit Employee' : '👤 Add Employee'}
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
                                    Full Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                />
                                {errors.name && <div className="form-error">{errors.name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Email <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@company.com"
                                />
                                {errors.email && <div className="form-error">{errors.email}</div>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
                                    className="form-select"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                >
                                    {DEPARTMENTS.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Designation <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-input ${errors.designation ? 'error' : ''}`}
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Developer"
                                />
                                {errors.designation && <div className="form-error">{errors.designation}</div>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Join Date <span className="required">*</span>
                                </label>
                                <input
                                    type="date"
                                    className={`form-input ${errors.joinDate ? 'error' : ''}`}
                                    name="joinDate"
                                    value={formData.joinDate}
                                    onChange={handleChange}
                                />
                                {errors.joinDate && <div className="form-error">{errors.joinDate}</div>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {employee ? 'Update' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;