import { useState, useEffect } from 'react';
import { AssetBarChart, CategoryPieChart, AssetTrendChart } from '../components/dashboard/Charts';
import { getSummary, getDepartmentReport } from '../services/reportService';
import { formatCurrency } from '../utils/constants';
import { HiOutlineDownload, HiOutlinePrinter } from 'react-icons/hi';
import toast from 'react-hot-toast';
import '../styles/dashboard.css';

const Reports = () => {
    const [summary, setSummary] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const [summaryData, deptData] = await Promise.all([
                getSummary(),
                getDepartmentReport()
            ]);
            setSummary(summaryData);
            setDepartments(deptData);
        } catch (error) {
            toast.error('Failed to load reports');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Print Function
    const handlePrint = () => {
        window.print();
    };

    // ✅ Export CSV Function
    const handleExportCSV = () => {
        if (!summary || departments.length === 0) {
            toast.error('No data to export');
            return;
        }

        let csvContent = "Asset Management Report\n\n";

        // Summary section
        csvContent += "SUMMARY\n";
        csvContent += `Total Asset Value,${summary.totalValue}\n`;
        csvContent += `Average Asset Value,${summary.avgValue}\n`;
        csvContent += `Utilization Rate,${summary.utilizationRate}%\n`;
        csvContent += `Total Assignments,${summary.totalAssignments}\n`;
        csvContent += `Total Assets,${summary.totalAssets}\n`;
        csvContent += `Total Employees,${summary.totalEmployees}\n\n`;

        // Department section
        csvContent += "DEPARTMENT BREAKDOWN\n";
        csvContent += "Department,Employees,Assets Assigned,Avg per Employee\n";
        departments.forEach(dept => {
            csvContent += `${dept.department},${dept.employees},${dept.assets},${dept.avgPerEmployee}\n`;
        });

        csvContent += "\n";

        // Monthly section
        csvContent += "MONTHLY DATA\n";
        csvContent += "Month,Assets,Cost,Assigned,Available\n";
        summary.monthlyData.forEach(m => {
            csvContent += `${m.month},${m.assets},${m.cost},${m.assigned},${m.available}\n`;
        });

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Asset_Report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);

        toast.success('Report exported successfully!');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading reports...</p>
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">
                        Comprehensive overview of your asset management
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {/* ✅ onClick add kiya */}
                    <button className="btn btn-outline" onClick={handlePrint}>
                        <HiOutlinePrinter /> Print
                    </button>
                    {/* ✅ onClick add kiya */}
                    <button className="btn btn-primary" onClick={handleExportCSV}>
                        <HiOutlineDownload /> Export CSV
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-value">{formatCurrency(summary.totalValue)}</div>
                    <div className="stat-label">Total Asset Value</div>
                </div>
                <div className="stat-card success">
                    <div className="stat-value">{formatCurrency(summary.avgValue)}</div>
                    <div className="stat-label">Average Asset Value</div>
                </div>
                <div className="stat-card warning">
                    <div className="stat-value">{summary.utilizationRate}%</div>
                    <div className="stat-label">Utilization Rate</div>
                </div>
                <div className="stat-card info">
                    <div className="stat-value">{summary.totalAssignments}</div>
                    <div className="stat-label">Total Assignments</div>
                </div>
            </div>

            {/* Charts */}
            <div className="dashboard-grid-equal">
                <AssetBarChart monthlyData={summary.monthlyData} />
                <CategoryPieChart categoryData={summary.categoryData} />
            </div>

            <AssetTrendChart monthlyData={summary.monthlyData} />

            {/* Department Breakdown */}
            <div className="chart-card" style={{ marginTop: '24px' }}>
                <div className="chart-card-header">
                    <div>
                        <div className="chart-card-title">Department Breakdown</div>
                        <div className="chart-card-subtitle">
                            Asset distribution across departments
                        </div>
                    </div>
                </div>
                <div className="chart-card-body">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Employees</th>
                                    <th>Assets Assigned</th>
                                    <th>Avg per Employee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((dept) => (
                                    <tr key={dept.department}>
                                        <td style={{ fontWeight: 600 }}>
                                            {dept.department}
                                        </td>
                                        <td>{dept.employees}</td>
                                        <td>{dept.assets}</td>
                                        <td>{dept.avgPerEmployee}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;