import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineUsers,
    HiOutlineSwitchHorizontal,
    HiOutlineDocumentReport,
    HiOutlineLogout
} from 'react-icons/hi';

const Sidebar = ({ collapsed, mobileOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const [assetCount, setAssetCount] = useState(0);
    const [assignmentCount, setAssignmentCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // ✅ axios.get → api.get
                // ✅ Token automatic lagega api.js interceptor se
                // ✅ URL bhi short hai kyunki baseURL already set hai
                const assetRes = await api.get('/assets/count');
                const assignmentRes = await api.get('/assignments/count');

                setAssetCount(assetRes.data.count || 0);
                setAssignmentCount(assignmentRes.data.count || 0);

            } catch (err) {
                console.error('Error:', err.response?.data || err.message);
            }
        };

        fetchCounts();
    }, []);

    const navItems = [
        {
            section: 'Main',
            items: [
                { path: '/', icon: <HiOutlineViewGrid />, label: 'Dashboard' },
                { path: '/assets', icon: <HiOutlineCube />, label: 'Assets', badge: assetCount },
                { path: '/employees', icon: <HiOutlineUsers />, label: 'Employees' },
                { path: '/assignments', icon: <HiOutlineSwitchHorizontal />, label: 'Assignments', badge: assignmentCount },
            ]
        },
        {
            section: 'Analytics',
            items: [
                { path: '/reports', icon: <HiOutlineDocumentReport />, label: 'Reports' },
            ]
        }
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

                {/* Logo */}
                <div className="sidebar-header">
                    <div className="sidebar-logo-icon">🏢</div>
                    <div className="sidebar-logo-text">
                        <h1>AssetHub</h1>
                        <span>Corporate Registry</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((section) => (
                        <div className="nav-section" key={section.section}>
                            <div className="nav-section-title">{section.section}</div>

                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={onClose}
                                    end={item.path === '/'}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-text">{item.label}</span>

                                    {item.badge !== undefined && (
                                        <span className="nav-badge">{item.badge}</span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <div className="nav-item" onClick={logout} style={{ cursor: 'pointer' }}>
                        <span className="nav-icon"><HiOutlineLogout /></span>
                        <span className="nav-text">Logout</span>
                    </div>

                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            {user?.avatar || 'U'}
                        </div>
                        <div className="sidebar-footer-info">
                            <h4>{user?.name || 'User'}</h4>
                            <span>{user?.role || 'Admin'}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="sidebar-overlay" onClick={onClose}></div>
            )}
        </>
    );
};

export default Sidebar;