import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/dashboard/StatsCard';
import {
    AssetBarChart,
    CategoryPieChart,
    AssetTrendChart,
} from '../components/dashboard/Charts';
import { getSummary } from '../services/reportService';
import {
    HiOutlineCube,
    HiOutlineUsers,
    HiOutlineSwitchHorizontal,
    HiOutlineCurrencyRupee,
    HiOutlinePlus,
    HiOutlineDocumentAdd,
    HiOutlineUserAdd,
    HiOutlineDocumentReport,
    HiOutlineRefresh,
} from 'react-icons/hi';
import { formatCurrency } from '../utils/constants';
import toast from 'react-hot-toast';
import '../styles/dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const data = await getSummary();
            setSummary(data);
        } catch (error) {
            console.log(
                'DASHBOARD ERROR:',
                error.response?.data || error.message
            );
            toast.error(
                error.response?.data?.message ||
                    'Failed to load dashboard data'
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ─── Loading ───────────────────────────────────────────
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* ─── Header ─────────────────────────────────── */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className="btn btn-outline"
                        onClick={() => fetchSummary(true)}
                        disabled={refreshing}
                    >
                        <HiOutlineRefresh
                            style={{
                                animation: refreshing
                                    ? 'spin 1s linear infinite'
                                    : 'none',
                            }}
                        />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/assets')}
                    >
                        <HiOutlinePlus /> Add Asset
                    </button>
                </div>
            </div>

            {/* ─── Stats Cards ─────────────────────────────── */}
            <div className="stats-grid">
                <StatsCard
                    icon={<HiOutlineCube />}
                    label="Total Assets"
                    value={summary?.totalAssets ?? 0}
                    variant="primary"
                />
                <StatsCard
                    icon={<HiOutlineUsers />}
                    label="Total Employees"
                    value={summary?.totalEmployees ?? 0}
                    variant="success"
                />
                <StatsCard
                    icon={<HiOutlineSwitchHorizontal />}
                    label="Active Assignments"
                    // ✅ activeAssignments backend se aa raha hai
                    value={summary?.activeAssignments ?? 0}
                    variant="warning"
                />
                <StatsCard
                    icon={<HiOutlineCurrencyRupee />}
                    label="Total Value"
                    value={formatCurrency(summary?.totalValue ?? 0)}
                    variant="info"
                />
            </div>

            {/* ─── Charts Row 1 ────────────────────────────── */}
            <div className="dashboard-grid">
                {/* ✅ Props pass ho rahe hain */}
                <AssetBarChart
                    monthlyData={summary?.monthlyData ?? []}
                />
                <CategoryPieChart
                    categoryData={summary?.categoryData ?? {}}
                />
            </div>

            {/* ─── Charts Row 2 + Activity ─────────────────── */}
            <div className="dashboard-grid-equal">
                {/* ✅ Props pass ho rahe hain */}
                <AssetTrendChart
                    monthlyData={summary?.monthlyData ?? []}
                />

                {/* Recent Activity */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <div className="chart-card-title">
                                Recent Activity
                            </div>
                            <div className="chart-card-subtitle">
                                Latest movements
                            </div>
                        </div>
                        <span
                            style={{
                                fontSize: '11px',
                                background: '#dcfce7',
                                color: '#16a34a',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                fontWeight: '600',
                            }}
                        >
                            ● Live
                        </span>
                    </div>
                    <div className="chart-card-body">
                        <div className="activity-list">
                            {summary?.recentActivity &&
                            summary.recentActivity.length > 0 ? (
                                summary.recentActivity.map(
                                    (act, i) => (
                                        <div
                                            className="activity-item"
                                            key={i}
                                        >
                                            <div
                                                className={`activity-dot ${act.type}`}
                                            ></div>
                                            <div className="activity-content">
                                                <p
                                                    className="activity-text"
                                                    dangerouslySetInnerHTML={{
                                                        __html: act.text,
                                                    }}
                                                />
                                                <span className="activity-time">
                                                    {act.time}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )
                            ) : (
                                <div
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px 0',
                                        color: 'var(--gray-400)',
                                    }}
                                >
                                    <span style={{ fontSize: '36px' }}>
                                        📭
                                    </span>
                                    <p
                                        style={{
                                            marginTop: '8px',
                                            fontSize: '14px',
                                        }}
                                    >
                                        No recent activity
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Asset Status + Quick Actions ────────────── */}
            <div className="dashboard-grid-equal">
                {/* Asset Status */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <div className="chart-card-title">
                                Asset Status
                            </div>
                            <div className="chart-card-subtitle">
                                Current distribution
                            </div>
                        </div>
                    </div>
                    <div className="chart-card-body">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                            }}
                        >
                            {/* Assigned Bar */}
                            {[
                                {
                                    label: 'Assigned',
                                    count: summary?.assignedCount ?? 0,
                                    color: '#4F46E5',
                                },
                                {
                                    label: 'Available',
                                    count: summary?.availableCount ?? 0,
                                    color: '#10B981',
                                },
                                {
                                    label: 'Maintenance',
                                    count:
                                        summary?.maintenanceCount ?? 0,
                                    color: '#F59E0B',
                                },
                                {
                                    label: 'Retired',
                                    count: summary?.retiredCount ?? 0,
                                    color: '#EF4444',
                                },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent:
                                                'space-between',
                                            marginBottom: '6px',
                                            fontSize: '13px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: 'var(--gray-600)',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            style={{ fontWeight: '700' }}
                                        >
                                            {item.count} /{' '}
                                            {summary?.totalAssets ?? 0}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            height: '8px',
                                            background:
                                                'var(--gray-100)',
                                            borderRadius: '999px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: '100%',
                                                width: `${
                                                    summary?.totalAssets
                                                        ? (item.count /
                                                              summary.totalAssets) *
                                                          100
                                                        : 0
                                                }%`,
                                                background: item.color,
                                                borderRadius: '999px',
                                                transition:
                                                    'width 0.8s ease',
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Utilization */}
                            <div
                                style={{
                                    padding: '12px',
                                    background: 'var(--gray-50)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '4px',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '13px',
                                        color: 'var(--gray-600)',
                                    }}
                                >
                                    Utilization Rate
                                </span>
                                <span
                                    style={{
                                        fontSize: '22px',
                                        fontWeight: '800',
                                        color: 'var(--primary)',
                                    }}
                                >
                                    {summary?.utilizationRate ?? 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div className="chart-card-title">
                            Quick Actions
                        </div>
                    </div>
                    <div className="chart-card-body">
                        <div className="quick-actions">
                            <button
                                className="quick-action-btn"
                                onClick={() => navigate('/assets')}
                            >
                                <div className="quick-action-icon stat-icon primary">
                                    <HiOutlineCube />
                                </div>
                                <span className="quick-action-text">
                                    Add New Asset
                                </span>
                            </button>
                            <button
                                className="quick-action-btn"
                                onClick={() => navigate('/employees')}
                            >
                                <div className="quick-action-icon stat-icon success">
                                    <HiOutlineUserAdd />
                                </div>
                                <span className="quick-action-text">
                                    Add Employee
                                </span>
                            </button>
                            <button
                                className="quick-action-btn"
                                onClick={() =>
                                    navigate('/assignments')
                                }
                            >
                                <div className="quick-action-icon stat-icon warning">
                                    <HiOutlineDocumentAdd />
                                </div>
                                <span className="quick-action-text">
                                    Assign Asset
                                </span>
                            </button>
                            <button
                                className="quick-action-btn"
                                onClick={() => navigate('/reports')}
                            >
                                <div className="quick-action-icon stat-icon info">
                                    <HiOutlineDocumentReport />
                                </div>
                                <span className="quick-action-text">
                                    View Reports
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;