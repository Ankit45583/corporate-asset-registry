import { useState } from "react";
import { HiOutlineX, HiOutlineInformationCircle } from "react-icons/hi";

const AssignAsset = ({ assets, employees, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        asset: "",
        employee: "",
        assignDate: new Date().toISOString().split("T")[0],
        notes: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.asset && formData.employee) {
            onSave(formData);
        }
    };

    const selectedAsset = assets.find(a => a._id === formData.asset);
    const selectedEmployee = employees.find(e => e._id === formData.employee);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
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
                                Select an available asset and an active employee.
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Asset <span className="required">*</span></label>
                            <select className="form-select" name="asset" value={formData.asset} onChange={handleChange} required>
                                <option value="">-- Choose an available asset --</option>
                                {assets.map(asset => (
                                    <option key={asset._id} value={asset._id}>
                                        {asset.name} ({asset.serialNumber})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Employee <span className="required">*</span></label>
                            <select className="form-select" name="employee" value={formData.employee} onChange={handleChange} required>
                                <option value="">-- Choose an employee --</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>
                                        {emp.name} - {emp.department}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Assignment Date</label>
                            <input type="date" className="form-input" name="assignDate" value={formData.assignDate} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea className="form-textarea" name="notes" value={formData.notes} onChange={handleChange} placeholder="Reason for assignment..." rows={3} />
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