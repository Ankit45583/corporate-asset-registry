import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import api from "../../services/api";
import {
    HiOutlineMenu,
    HiOutlineBell,
    HiOutlineSearch,
    HiOutlineMoon,
    HiOutlineSun,
    HiOutlineChevronRight,
    HiOutlineUser,
    HiOutlineCog,
    HiOutlineLogout,
    HiOutlineX,
} from "react-icons/hi";

const Navbar = ({ onToggleSidebar, onToggleMobile }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Notifications context se
    const {
        notifications,
        unreadCount,
        settings,
        markAsRead,
        markAllRead,
        clearNotifications,
        fetchNotifications,
    } = useNotifications();

    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // ✅ Dark mode
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved === "true";
    });

    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const searchRef = useRef(null);

    // ✅ Dark mode effect
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "true");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "false");
        }
    }, [darkMode]);

    // ✅ Search data
    const [searchData, setSearchData] = useState([
        { type: "page", name: "Dashboard", path: "/", icon: "📊" },
        { type: "page", name: "Assets", path: "/assets", icon: "📦" },
        { type: "page", name: "Employees", path: "/employees", icon: "👥" },
        { type: "page", name: "Assignments", path: "/assignments", icon: "🔗" },
        { type: "page", name: "Reports", path: "/reports", icon: "📈" },
        { type: "page", name: "Profile", path: "/profile", icon: "👤" },
        {
            type: "action",
            name: "Add New Asset",
            path: "/assets",
            icon: "➕",
            sub: "Create a new asset",
        },
        {
            type: "action",
            name: "Add Employee",
            path: "/employees",
            icon: "➕",
            sub: "Register employee",
        },
        {
            type: "action",
            name: "Assign Asset",
            path: "/assignments",
            icon: "🔗",
            sub: "Assign to employee",
        },
    ]);

    // ✅ Load real data for search
    useEffect(() => {
        const loadSearchData = async () => {
            try {
                const [assetRes, empRes] = await Promise.all([
                    api.get("/assets"),
                    api.get("/employees"),
                ]);

                const pages = [
                    { type: "page", name: "Dashboard", path: "/", icon: "📊" },
                    { type: "page", name: "Assets", path: "/assets", icon: "📦" },
                    { type: "page", name: "Employees", path: "/employees", icon: "👥" },
                    { type: "page", name: "Assignments", path: "/assignments", icon: "🔗" },
                    { type: "page", name: "Reports", path: "/reports", icon: "📈" },
                    { type: "page", name: "Profile", path: "/profile", icon: "👤" },
                ];

                const actions = [
                    {
                        type: "action",
                        name: "Add New Asset",
                        path: "/assets",
                        icon: "➕",
                        sub: "Create a new asset",
                    },
                    {
                        type: "action",
                        name: "Add Employee",
                        path: "/employees",
                        icon: "➕",
                        sub: "Register employee",
                    },
                    {
                        type: "action",
                        name: "Assign Asset",
                        path: "/assignments",
                        icon: "🔗",
                        sub: "Assign to employee",
                    },
                ];

                const assetItems = assetRes.data.map((a) => ({
                    type: "asset",
                    name: a.name,
                    path: "/assets",
                    icon:
                        a.category === "laptop"
                            ? "💻"
                            : a.category === "phone"
                            ? "📱"
                            : a.category === "printer"
                            ? "🖨️"
                            : a.category === "monitor"
                            ? "🖥️"
                            : "📦",
                    sub: `${a.category} • ${a.serialNumber}`,
                }));

                const empItems = empRes.data.map((e) => ({
                    type: "employee",
                    name: e.name,
                    path: "/employees",
                    icon: "👤",
                    sub: e.department || "No department",
                }));

                setSearchData([...pages, ...assetItems, ...empItems, ...actions]);
            } catch (err) {
                console.error("Search data error:", err);
            }
        };

        loadSearchData();
    }, []);

    // Search filter
    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = searchData.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (item.sub &&
                        item.sub.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setSearchResults(filtered.slice(0, 8));
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, searchData]);

    // Outside click close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setShowDropdown(false);
            if (notifRef.current && !notifRef.current.contains(e.target))
                setShowNotifications(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on route change
    useEffect(() => {
        setShowDropdown(false);
        setShowNotifications(false);
        setShowSearch(false);
        setSearchQuery("");
    }, [location]);

    // Ctrl+K shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setShowSearch(true);
            }
            if (e.key === "Escape") {
                setShowSearch(false);
                setSearchQuery("");
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const getPageTitle = () => {
        const routes = {
            "/": "Dashboard",
            "/assets": "Assets",
            "/employees": "Employees",
            "/assignments": "Assignments",
            "/reports": "Reports",
            "/profile": "Profile",
        };
        return routes[location.pathname] || "Page";
    };

    const handleSearchSelect = (item) => {
        navigate(item.path);
        setShowSearch(false);
        setSearchQuery("");
    };

    const getTypeBadgeClass = (type) => {
        const classes = {
            page: "badge-primary",
            asset: "badge-info",
            employee: "badge-success",
            action: "badge-warning",
        };
        return classes[type] || "badge-gray";
    };

    const getTypeLabel = (type) => {
        const labels = {
            page: "Page",
            asset: "Asset",
            employee: "Employee",
            action: "Action",
        };
        return labels[type] || type;
    };

    const handleProfileClick = () => {
        setShowDropdown(false);
        navigate("/profile");
    };

    const handleLogout = () => {
        setShowDropdown(false);
        logout();
        navigate("/login");
    };

    // ✅ Notification variant class helper
    const getNotifVariantClass = (variant) => {
        const map = {
            success: "success",
            warning: "warning",
            danger: "danger",
            info: "info",
        };
        return map[variant] || "info";
    };

    return (
        <>
            <header className="navbar">
                <div className="navbar-left">
                    <button
                        className="sidebar-toggle"
                        onClick={() => {
                            if (window.innerWidth <= 1024) onToggleMobile();
                            else onToggleSidebar();
                        }}
                    >
                        <HiOutlineMenu />
                    </button>
                    <div className="navbar-breadcrumb">
                        <span>Home</span>
                        <HiOutlineChevronRight size={14} />
                        <span className="current">{getPageTitle()}</span>
                    </div>
                </div>

                <div className="navbar-right">
                    {/* Search */}
                    <button
                        className="navbar-icon-btn"
                        onClick={() => setShowSearch(true)}
                        title="Search (Ctrl+K)"
                    >
                        <HiOutlineSearch />
                    </button>

                    {/* ✅ Notifications - Context se */}
                    <div className="dropdown" ref={notifRef}>
                        <button
                            className="navbar-icon-btn"
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowDropdown(false);
                            }}
                        >
                            <HiOutlineBell />
                            {/* ✅ pushNotif ON hai aur unread hain tabhi badge dikhao */}
                            {settings.pushNotif && unreadCount > 0 && (
                                <span className="notification-dot"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="dropdown-menu notification-dropdown">
                                <div className="notification-header">
                                    <h4>
                                        Notifications
                                        {settings.pushNotif && unreadCount > 0 && (
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: "var(--primary)",
                                                    marginLeft: "8px",
                                                }}
                                            >
                                                ({unreadCount} new)
                                            </span>
                                        )}
                                    </h4>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        {settings.pushNotif && unreadCount > 0 && (
                                            <button
                                                className="mark-all-read"
                                                onClick={markAllRead}
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                        {settings.pushNotif &&
                                            notifications.length > 0 && (
                                                <button
                                                    className="mark-all-read"
                                                    onClick={clearNotifications}
                                                    style={{ color: "var(--danger)" }}
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                    </div>
                                </div>

                                <div className="notification-list">
                                    {/* ✅ pushNotif OFF hai */}
                                    {!settings.pushNotif ? (
                                        <div
                                            style={{
                                                padding: "32px 24px",
                                                textAlign: "center",
                                                color: "var(--gray-500)",
                                            }}
                                        >
                                            <span style={{ fontSize: "36px" }}>🔕</span>
                                            <p
                                                style={{
                                                    marginTop: "10px",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    color: "var(--gray-700)",
                                                }}
                                            >
                                                Push notifications disabled
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "12px",
                                                    marginTop: "4px",
                                                    color: "var(--gray-400)",
                                                }}
                                            >
                                                Enable in Profile → Notifications
                                            </p>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                style={{ marginTop: "12px" }}
                                                onClick={() => {
                                                    setShowNotifications(false);
                                                    navigate("/profile");
                                                }}
                                            >
                                                Go to Settings
                                            </button>
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        // ✅ Notifications empty
                                        <div
                                            style={{
                                                padding: "32px 24px",
                                                textAlign: "center",
                                                color: "var(--gray-500)",
                                            }}
                                        >
                                            <span style={{ fontSize: "36px" }}>🎉</span>
                                            <p
                                                style={{
                                                    marginTop: "10px",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    color: "var(--gray-700)",
                                                }}
                                            >
                                                All caught up!
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "12px",
                                                    marginTop: "4px",
                                                    color: "var(--gray-400)",
                                                }}
                                            >
                                                No notifications right now
                                            </p>
                                        </div>
                                    ) : (
                                        // ✅ Notifications list
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`notification-item ${
                                                    !notif.read ? "unread" : ""
                                                }`}
                                                onClick={() => markAsRead(notif.id)}
                                            >
                                                <div
                                                    className={`notification-icon-wrap ${getNotifVariantClass(
                                                        notif.variant
                                                    )}`}
                                                >
                                                    {notif.icon}
                                                </div>
                                                <div className="notification-content">
                                                    <div className="notification-title">
                                                        {notif.title}
                                                    </div>
                                                    <div className="notification-message">
                                                        {notif.message}
                                                    </div>
                                                    <div className="notification-time">
                                                        {notif.time}
                                                    </div>
                                                </div>
                                                {!notif.read && (
                                                    <div className="notification-unread-dot"></div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* ✅ Footer - pushNotif ON hone par */}
                                {settings.pushNotif && (
                                    <div className="notification-footer">
                                        <button
                                            onClick={() => {
                                                setShowNotifications(false);
                                                fetchNotifications();
                                            }}
                                        >
                                            Refresh notifications
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        className="navbar-icon-btn"
                        onClick={() => setDarkMode(!darkMode)}
                        title={darkMode ? "Light Mode" : "Dark Mode"}
                    >
                        {darkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
                    </button>

                    {/* Profile Dropdown */}
                    <div className="dropdown" ref={dropdownRef}>
                        <div
                            className="navbar-profile"
                            onClick={() => {
                                setShowDropdown(!showDropdown);
                                setShowNotifications(false);
                            }}
                        >
                            <div className="navbar-profile-avatar">
                                {user?.avatar || "U"}
                            </div>
                            <div className="navbar-profile-info">
                                <span className="navbar-profile-name">{user?.name}</span>
                                <span className="navbar-profile-role">{user?.role}</span>
                            </div>
                        </div>

                        {showDropdown && (
                            <div className="dropdown-menu profile-dropdown">
                                <div className="dropdown-profile-header">
                                    <div className="dropdown-profile-avatar">
                                        {user?.avatar || "U"}
                                    </div>
                                    <div className="dropdown-profile-info">
                                        <h4>{user?.name}</h4>
                                        <span>{user?.email}</span>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <div
                                    className="dropdown-item"
                                    onClick={handleProfileClick}
                                >
                                    <HiOutlineUser /> My Profile
                                </div>
                                <div
                                    className="dropdown-item"
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate("/profile");
                                    }}
                                >
                                    <HiOutlineCog /> Settings
                                </div>
                                <div className="dropdown-divider"></div>
                                <div
                                    className="dropdown-item danger"
                                    onClick={handleLogout}
                                >
                                    <HiOutlineLogout /> Logout
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Search Modal */}
            {showSearch && (
                <div
                    className="search-overlay"
                    onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                    }}
                >
                    <div
                        className="search-modal"
                        ref={searchRef}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="search-modal-header">
                            <HiOutlineSearch className="search-modal-icon" />
                            <input
                                type="text"
                                className="search-modal-input"
                                placeholder="Search assets, employees, pages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <div className="search-shortcut">ESC</div>
                            <button
                                className="search-modal-close"
                                onClick={() => {
                                    setShowSearch(false);
                                    setSearchQuery("");
                                }}
                            >
                                <HiOutlineX />
                            </button>
                        </div>

                        {searchQuery.trim() === "" ? (
                            <div className="search-modal-body">
                                <div className="search-hint">
                                    <p className="search-hint-title">Quick Navigation</p>
                                    <div className="search-quick-links">
                                        {[
                                            { name: "Dashboard", path: "/", icon: "📊" },
                                            { name: "Assets", path: "/assets", icon: "📦" },
                                            {
                                                name: "Employees",
                                                path: "/employees",
                                                icon: "👥",
                                            },
                                            {
                                                name: "Assignments",
                                                path: "/assignments",
                                                icon: "🔗",
                                            },
                                            { name: "Reports", path: "/reports", icon: "📈" },
                                        ].map((item) => (
                                            <button
                                                key={item.path}
                                                className="search-quick-link"
                                                onClick={() => handleSearchSelect(item)}
                                            >
                                                <span>{item.icon}</span>
                                                <span>{item.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="search-hint">
                                    <p className="search-hint-text">
                                        💡 Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to open
                                        search anytime
                                    </p>
                                </div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="search-modal-body">
                                <div className="search-results-label">
                                    {searchResults.length} result
                                    {searchResults.length > 1 ? "s" : ""} found
                                </div>
                                <div className="search-results">
                                    {searchResults.map((item, index) => (
                                        <div
                                            key={index}
                                            className="search-result-item"
                                            onClick={() => handleSearchSelect(item)}
                                        >
                                            <div className="search-result-icon">
                                                {item.icon}
                                            </div>
                                            <div className="search-result-info">
                                                <div className="search-result-name">
                                                    {item.name}
                                                </div>
                                                {item.sub && (
                                                    <div className="search-result-sub">
                                                        {item.sub}
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                className={`badge ${getTypeBadgeClass(
                                                    item.type
                                                )}`}
                                            >
                                                {getTypeLabel(item.type)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="search-modal-body">
                                <div className="search-no-results">
                                    <span style={{ fontSize: "40px" }}>🔍</span>
                                    <p>
                                        No results for "
                                        <strong>{searchQuery}</strong>"
                                    </p>
                                    <span>Try different keywords</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;