import { useState } from 'react';
import { HiOutlineX, HiOutlineInformationCircle } from 'react-icons/hi';
import { SAMPLE_ASSETS, SAMPLE_EMPLOYEES } from '../../utils/constants';

const AssignAsset = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({
        assetId: '',
        employeeId: '',
        assignDate: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const availableAssets = SAMPLE_ASSETS.filter(a => a.status === 'available');
    const activeEmployees = SAMPLE_EMPLOYEES.filter(e => e.status === 'active');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.assetId && formData.employeeId) {
            const asset = SAMPLE_ASSETS.find(a => a.id === formData.assetId);
            const employee = SAMPLE_EMPLOYEES.find(e => e.id === formData.employeeId);
            onSave({
                id: `ASN-${String(Date.now()).slice(-3)}`,
                ...formData,
                assetName: asset?.name,
                employeeName: employee?.name,
                status: 'active',
                returnDate: null
            });
        }
    };

    const selectedAsset = SAMPLE_ASSETS.find(a => a.id === formData.assetId);
    const selectedEmployee = SAMPLE_EMPLOYEES.find(e => e.id === formData.employeeId);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">🔗 Assign Asset</h3>
                    <button className="modal-close" onClick={onClose}>
                        <HiOutlineX />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="assignment-info-box">
                            <HiOutlineInformationCircle className="assignment-info-icon" />
                            <div className="assignment-info-text">
                                Select an available asset and an active employee to create a new assignment.
                                The asset status will be changed to "Assigned" automatically.
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Select Asset <span className="required">*</span>
                            </label>
                            <select
                                className="form-select"
                                name="assetId"
                                value={formData.assetId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Choose an available asset --</option>
                                {availableAssets.map(asset => (
                                    <option key={asset.id} value={asset.id}>
                                        {asset.name} ({asset.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Select Employee <span className="required">*</span>
                            </label>
                            <select
                                className="form-select"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Choose an employee --</option>
                                {activeEmployees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name} - {emp.department}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Assignment Date</label>
                            <input
                                type="date"
                                className="form-input"
                                name="assignDate"
                                value={formData.assignDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-textarea"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Reason for assignment..."
                                rows={3}
                            />
                        </div>

                        {selectedAsset && selectedEmployee && (
                            <div className="assignment-summary">
                                <div className="summary-item">
                                    <span className="summary-label">Asset</span>
                                    <span className="summary-value">{selectedAsset.name}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Employee</span>
                                    <span className="summary-value">{selectedEmployee.name}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Department</span>
                                    <span className="summary-value">{selectedEmployee.department}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Date</span>
                                    <span className="summary-value">{formData.assignDate}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-success">Assign Asset</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignAsset;