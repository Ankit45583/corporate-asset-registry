import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeForm from "../components/employees/EmployeeForm";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../services/employeeService";
import { DEPARTMENTS } from "../utils/constants";
import toast from "react-hot-toast";
import "../styles/employees.css";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showForm, setShowForm] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await getEmployees();
            setEmployees(data);
        } catch (error) {
            toast.error('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.email.toLowerCase().includes(search.toLowerCase());
        const matchDept = deptFilter === "all" || emp.department === deptFilter;
        const matchStatus = statusFilter === "all" || emp.status === statusFilter;
        return matchSearch && matchDept && matchStatus;
    });

    const handleSave = async (empData) => {
        try {
            if (editEmployee) {
                const updated = await updateEmployee(editEmployee._id, empData);
                setEmployees(prev => prev.map(e => e._id === editEmployee._id ? updated : e));
                toast.success('Employee updated!');
            } else {
                const created = await createEmployee(empData);
                setEmployees(prev => [created, ...prev]);
                toast.success('Employee added!');
            }
            setShowForm(false);
            setEditEmployee(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this employee?')) {
            try {
                await deleteEmployee(id);
                setEmployees(prev => prev.filter(e => e._id !== id));
                toast.success('Employee deleted!');
            } catch (error) {
                toast.error('Failed to delete employee');
            }
        }
    };

    const activeCount = employees.filter(e => e.status === 'active').length;
    const totalAssets = employees.reduce((sum, e) => sum + (e.assetsCount || 0), 0);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading employees...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employees</h1>
                    <p className="page-subtitle">Manage your team • {filteredEmployees.length} employees</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditEmployee(null); setShowForm(true); }}>
                    <HiOutlinePlus /> Add Employee
                </button>
            </div>

            <div className="employee-stats">
                <div className="employee-stat">
                     <div 
                        className="employee-stat-value"
                        style={{ color: "var(--primary)" }}
                    >
                        {employees.length}
                    </div>
                    <div className="employee-stat-label">Total Employees</div>
                </div>
                <div className="employee-stat">
                    <div className="employee-stat-value" style={{ color: 'var(--success)' }}>{activeCount}</div>
                    <div className="employee-stat-label">Active</div>
                </div>
                <div className="employee-stat">
                    <div className="employee-stat-value" style={{ color: 'var(--primary)' }}>{totalAssets}</div>
                    <div className="employee-stat-label">Assets Assigned</div>
                </div>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <HiOutlineSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className="filter-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                    <option value="all">All Departments</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="card">
                <EmployeeTable
                    employees={filteredEmployees}
                    onEdit={(emp) => { setEditEmployee(emp); setShowForm(true); }}
                    onDelete={handleDelete}
                />
            </div>

            {showForm && (
                <EmployeeForm
                    employee={editEmployee}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditEmployee(null); }}
                />
            )}
        </div>
    );
};

export default Employees;