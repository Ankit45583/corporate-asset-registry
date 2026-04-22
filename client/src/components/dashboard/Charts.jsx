import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// ✅ Props se real data lega
export const AssetBarChart = ({ monthlyData = [] }) => {
    const [activeTab, setActiveTab] = useState('assets');

    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <div>
                    <div className="chart-card-title">Asset Procurement</div>
                    <div className="chart-card-subtitle">Monthly acquisition trends</div>
                </div>
                <div className="chart-tabs">
                    <button
                        className={`chart-tab ${activeTab === 'assets' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assets')}
                    >
                        Count
                    </button>
                    <button
                        className={`chart-tab ${activeTab === 'cost' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cost')}
                    >
                        Cost
                    </button>
                </div>
            </div>
            <div className="chart-card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Bar
                            dataKey={activeTab}
                            fill="#4F46E5"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// ✅ Props se real category data lega
export const CategoryPieChart = ({ categoryData = {} }) => {
    const pieData = Object.entries(categoryData).map(([name, value], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <div>
                    <div className="chart-card-title">Asset Categories</div>
                    <div className="chart-card-subtitle">Distribution by type</div>
                </div>
            </div>
            <div className="chart-card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => (
                                <span style={{ color: '#6B7280', fontSize: '13px' }}>
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// ✅ Props se real monthly trend data lega
export const AssetTrendChart = ({ monthlyData = [] }) => {
    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <div>
                    <div className="chart-card-title">Asset Utilization Trend</div>
                    <div className="chart-card-subtitle">
                        Assigned vs Available assets over time
                    </div>
                </div>
            </div>
            <div className="chart-card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="assigned"
                            stroke="#4F46E5"
                            fill="#EEF2FF"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="available"
                            stroke="#10B981"
                            fill="#D1FAE5"
                            strokeWidth={2}
                        />
                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            iconSize={8}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};