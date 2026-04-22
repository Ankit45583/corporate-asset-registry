import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import api from "../services/api";
import {
    HiOutlineUser,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineBriefcase,
    HiOutlineLocationMarker,
    HiOutlineCalendar,
    HiOutlineCamera,
    HiOutlinePencil,
    HiOutlineShieldCheck,
    HiOutlineCube,
    HiOutlineSwitchHorizontal,
    HiOutlineClock,
    HiOutlineCheck,
    HiOutlineLockClosed,
    HiOutlineBell,
    HiOutlineGlobe,
} from "react-icons/hi";
import toast from "react-hot-toast";
import "../styles/profile.css";

const Profile = () => {
    const { user, updateUser } = useAuth();

    // ✅ NotificationContext se settings lo
    const {
        notifications,
        settings: notifSettings,
        unreadCount,
        toggleSetting,
        saveSettings,
        resetSettings,
    } = useNotifications();

    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalAssets: 0,
        totalAssignments: 0,
        totalEmployees: 0,
        daysActive: 0,
    });

    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        department: user?.department || "",
        designation: user?.designation || "",
        location: user?.location || "",
        bio: user?.bio || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // ✅ Stats fetch
    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [assetRes, assignRes, empRes] = await Promise.all([
                api.get("/assets"),
                api.get("/assignments"),
                api.get("/employees"),
            ]);

            const joinDate = user?.createdAt
                ? new Date(user.createdAt)
                : new Date();
            const today = new Date();
            const daysActive = Math.floor(
                (today - joinDate) / (1000 * 60 * 60 * 24)
            );

            setStats({
                totalAssets: assetRes.data.length,
                totalAssignments: assignRes.data.length,
                totalEmployees: empRes.data.length,
                daysActive: daysActive || 1,
            });
        } catch (err) {
            console.error("Stats error:", err);
        }
    };

    // ✅ Profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await api.put("/auth/profile", profileData);
            updateUser(data);
            toast.success("Profile updated successfully!");
            setActiveTab("overview");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    // ✅ Password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters!");
            return;
        }

        try {
            setLoading(true);
            await api.put("/auth/password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            toast.success("Password changed successfully!");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    // ✅ Notification toggle - Context ka use karo
    const handleNotifToggle = (key) => {
        toggleSetting(key);
    };

    // ✅ Notification save
    const handleNotifSave = () => {
        saveSettings(notifSettings);
        toast.success("Notification settings saved!");
    };

    // ✅ Notification reset
    const handleNotifReset = () => {
        resetSettings();
        toast.success("Settings reset to default!");
    };

    const statsCards = [
        {
            label: "Assets Managed",
            value: stats.totalAssets,
            icon: <HiOutlineCube />,
            color: "primary",
        },
        {
            label: "Assignments Made",
            value: stats.totalAssignments,
            icon: <HiOutlineSwitchHorizontal />,
            color: "success",
        },
        {
            label: "Employees",
            value: stats.totalEmployees,
            icon: <HiOutlineBriefcase />,
            color: "warning",
        },
        {
            label: "Days Active",
            value: stats.daysActive,
            icon: <HiOutlineClock />,
            color: "info",
        },
    ];

    const tabs = [
        { id: "overview", label: "Overview", icon: <HiOutlineUser /> },
        { id: "edit", label: "Edit Profile", icon: <HiOutlinePencil /> },
        { id: "security", label: "Security", icon: <HiOutlineLockClosed /> },
        { id: "notifications", label: "Notifications", icon: <HiOutlineBell /> },
    ];

    // ✅ Notification items config
    const notificationItems = [
        {
            key: "emailNotif",
            label: "Email Notifications",
            desc: "Receive notifications via email",
            icon: "📧",
            affectsNavbar: false,
        },
        {
            key: "pushNotif",
            label: "Push Notifications",
            desc: "Show notifications in navbar bell icon",
            icon: "🔔",
            affectsNavbar: true,
        },
        {
            key: "assetAlerts",
            label: "Asset Alerts",
            desc: "Asset assigned, returned, retired notifications",
            icon: "📦",
            affectsNavbar: true,
        },
        {
            key: "maintenanceAlerts",
            label: "Maintenance Alerts",
            desc: "Alerts for maintenance schedules",
            icon: "🔧",
            affectsNavbar: true,
        },
        {
            key: "reportAlerts",
            label: "Report Notifications",
            desc: "Get notified when reports are generated",
            icon: "📊",
            affectsNavbar: true,
        },
        {
            key: "weeklyDigest",
            label: "Weekly Digest",
            desc: "Receive weekly summary of all activities",
            icon: "📅",
            affectsNavbar: false,
        },
    ];

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // ✅ Count from context settings
    const enabledCount = Object.values(notifSettings).filter(Boolean).length;
    const totalCount = Object.keys(notifSettings).length;

    return (
        <div className="page-container">
            {/* Profile Header */}
            <div className="profile-header-card">
                <div className="profile-cover"></div>
                <div className="profile-header-content">
                    <div className="profile-header-left">
                        <div className="profile-avatar-large">
                            <span>{getInitials(profileData.name)}</span>
                            <button
                                className="profile-avatar-edit"
                                title="Change photo"
                            >
                                <HiOutlineCamera />
                            </button>
                        </div>
                        <div className="profile-header-info">
                            <h1 className="profile-name">{profileData.name}</h1>
                            <p className="profile-designation">
                                {profileData.designation || "No designation"} •{" "}
                                {profileData.department || "No department"}
                            </p>
                            <div className="profile-meta">
                                <span className="profile-meta-item">
                                    <HiOutlineMail /> {profileData.email}
                                </span>
                                {profileData.location && (
                                    <span className="profile-meta-item">
                                        <HiOutlineLocationMarker />{" "}
                                        {profileData.location}
                                    </span>
                                )}
                                <span className="profile-meta-item">
                                    <HiOutlineCalendar /> Joined{" "}
                                    {new Date(
                                        user?.createdAt || Date.now()
                                    ).toLocaleDateString("en-IN", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="profile-header-right">
                        <span
                            className="badge badge-success"
                            style={{ padding: "6px 16px", fontSize: "13px" }}
                        >
                            <HiOutlineShieldCheck /> {user?.role || "Admin"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="profile-stats-grid">
                {statsCards.map((stat, i) => (
                    <div className="profile-stat-card" key={i}>
                        <div
                            className={`profile-stat-icon stat-icon ${stat.color}`}
                        >
                            {stat.icon}
                        </div>
                        <div className="profile-stat-info">
                            <div className="profile-stat-value">{stat.value}</div>
                            <div className="profile-stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`profile-tab ${
                            activeTab === tab.id ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {/* ✅ Notification tab pe badge */}
                        {tab.id === "notifications" &&
                            !notifSettings.pushNotif && (
                                <span
                                    style={{
                                        fontSize: "10px",
                                        background: "#ef4444",
                                        color: "white",
                                        borderRadius: "999px",
                                        padding: "1px 6px",
                                        marginLeft: "4px",
                                    }}
                                >
                                    Off
                                </span>
                            )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="profile-tab-content">
                {/* ─── Overview Tab ─────────────────────────────────── */}
                {activeTab === "overview" && (
                    <div className="dashboard-grid-equal">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">About</h3>
                            </div>
                            <div className="card-body">
                                <p
                                    style={{
                                        color: "var(--gray-600)",
                                        lineHeight: "1.7",
                                        marginBottom: "20px",
                                    }}
                                >
                                    {profileData.bio ||
                                        "No bio added yet. Go to Edit Profile to add one."}
                                </p>
                                <div className="profile-details-list">
                                    <div className="profile-detail-row">
                                        <span className="profile-detail-label">
                                            <HiOutlineUser /> Full Name
                                        </span>
                                        <span className="profile-detail-value">
                                            {profileData.name}
                                        </span>
                                    </div>
                                    <div className="profile-detail-row">
                                        <span className="profile-detail-label">
                                            <HiOutlineMail /> Email
                                        </span>
                                        <span className="profile-detail-value">
                                            {profileData.email}
                                        </span>
                                    </div>
                                    <div className="profile-detail-row">
                                        <span className="profile-detail-label">
                                            <HiOutlinePhone /> Phone
                                        </span>
                                        <span className="profile-detail-value">
                                            {profileData.phone || "Not added"}
                                        </span>
                                    </div>
                                    <div className="profile-detail-row">
                                        <span className="profile-detail-label">
                                            <HiOutlineBriefcase /> Department
                                        </span>
                                        <span className="profile-detail-value">
                                            {profileData.department || "Not added"}
                                        </span>
                                    </div>
                                    <div className="profile-detail-row">
                                        <span className="profile-detail-label">
                                            <HiOutlineLocationMarker /> Location
                                        </span>
                                        <span className="profile-detail-value">
                                            {profileData.location || "Not added"}
                                        </span>
                                    </div>
                                    <div className="profile-detail-row">
                                        <span className="profile-detail-label">
                                            <HiOutlineGlobe /> Language
                                        </span>
                                        <span className="profile-detail-value">
                                            English, Hindi
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Summary */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Quick Summary</h3>
                            </div>
                            <div className="card-body">
                                <div className="activity-list">
                                    <div className="activity-item">
                                        <div
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "var(--radius-md)",
                                                background: "var(--primary-50)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "16px",
                                            }}
                                        >
                                            📦
                                        </div>
                                        <div className="activity-content">
                                            <p className="activity-text">
                                                Total {stats.totalAssets} assets managed
                                            </p>
                                            <span className="activity-time">
                                                Assets in system
                                            </span>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "var(--radius-md)",
                                                background: "var(--primary-50)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "16px",
                                            }}
                                        >
                                            🔗
                                        </div>
                                        <div className="activity-content">
                                            <p className="activity-text">
                                                {stats.totalAssignments} assignments made
                                            </p>
                                            <span className="activity-time">
                                                Total assignments
                                            </span>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "var(--radius-md)",
                                                background: "var(--primary-50)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "16px",
                                            }}
                                        >
                                            👥
                                        </div>
                                        <div className="activity-content">
                                            <p className="activity-text">
                                                {stats.totalEmployees} employees registered
                                            </p>
                                            <span className="activity-time">
                                                Team members
                                            </span>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "var(--radius-md)",
                                                background: "var(--primary-50)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "16px",
                                            }}
                                        >
                                            ⏰
                                        </div>
                                        <div className="activity-content">
                                            <p className="activity-text">
                                                Active for {stats.daysActive} days
                                            </p>
                                            <span className="activity-time">
                                                Since account creation
                                            </span>
                                        </div>
                                    </div>

                                    {/* ✅ Live notification summary from context */}
                                    <div className="activity-item">
                                        <div
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "var(--radius-md)",
                                                background: notifSettings.pushNotif
                                                    ? "var(--primary-50)"
                                                    : "#fef2f2",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "16px",
                                            }}
                                        >
                                            {notifSettings.pushNotif ? "🔔" : "🔕"}
                                        </div>
                                        <div className="activity-content">
                                            <p className="activity-text">
                                                {notifSettings.pushNotif
                                                    ? `${unreadCount} unread notification${
                                                          unreadCount !== 1 ? "s" : ""
                                                      } in navbar`
                                                    : "Push notifications are disabled"}
                                            </p>
                                            <span className="activity-time">
                                                {enabledCount}/{totalCount} settings
                                                enabled •{" "}
                                                <button
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "var(--primary)",
                                                        cursor: "pointer",
                                                        fontSize: "inherit",
                                                        padding: 0,
                                                    }}
                                                    onClick={() =>
                                                        setActiveTab("notifications")
                                                    }
                                                >
                                                    Manage
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Edit Profile Tab ──────────────────────────────── */}
                {activeTab === "edit" && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Edit Profile Information</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleProfileUpdate}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={profileData.name}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={profileData.email}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={profileData.phone}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    phone: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={profileData.location}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    location: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={profileData.department}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    department: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Designation
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={profileData.designation}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    designation: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        className="form-textarea"
                                        rows={4}
                                        value={profileData.bio}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                bio: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        justifyContent: "flex-end",
                                        marginTop: "8px",
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setActiveTab("overview")}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ─── Security Tab ──────────────────────────────────── */}
                {activeTab === "security" && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Change Password</h3>
                        </div>
                        <div className="card-body">
                            <form
                                onSubmit={handlePasswordChange}
                                style={{ maxWidth: "480px" }}
                            >
                                <div className="form-group">
                                    <label className="form-label">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                currentPassword: e.target.value,
                                            })
                                        }
                                        placeholder="Enter current password"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value,
                                            })
                                        }
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ marginTop: "8px" }}
                                    disabled={loading}
                                >
                                    <HiOutlineLockClosed />
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* ─── Notifications Tab ─────────────────────────────── */}
                {activeTab === "notifications" && (
                    <div className="card">
                        <div
                            className="card-header"
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <h3 className="card-title">
                                    Notification Preferences
                                </h3>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "var(--gray-500)",
                                        marginTop: "4px",
                                    }}
                                >
                                    {enabledCount} of {totalCount} notifications
                                    enabled •{" "}
                                    {notifSettings.pushNotif ? (
                                        <span style={{ color: "var(--success)" }}>
                                            🟢 Navbar active ({unreadCount} unread)
                                        </span>
                                    ) : (
                                        <span style={{ color: "#ef4444" }}>
                                            🔴 Navbar notifications OFF
                                        </span>
                                    )}
                                </p>
                            </div>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={handleNotifReset}
                            >
                                Reset to Default
                            </button>
                        </div>

                        <div className="card-body">
                            {/* ✅ pushNotif OFF warning */}
                            {!notifSettings.pushNotif && (
                                <div
                                    style={{
                                        background: "#fef2f2",
                                        border: "1px solid #fecaca",
                                        borderRadius: "var(--radius-md)",
                                        padding: "12px 16px",
                                        marginBottom: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        fontSize: "13px",
                                        color: "#dc2626",
                                    }}
                                >
                                    <span style={{ fontSize: "18px" }}>⚠️</span>
                                    <span>
                                        Push Notifications are disabled. Navbar
                                        bell icon will show no notifications.
                                    </span>
                                </div>
                            )}

                            <div className="notification-settings">
                                {notificationItems.map((setting) => (
                                    <div
                                        className="notification-setting-item"
                                        key={setting.key}
                                        style={{
                                            opacity:
                                                notifSettings[setting.key]
                                                    ? 1
                                                    : 0.6,
                                            transition: "opacity 0.3s ease",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                            }}
                                        >
                                            <span style={{ fontSize: "20px" }}>
                                                {setting.icon}
                                            </span>
                                            <div className="notification-setting-info">
                                                <div className="notification-setting-label">
                                                    {setting.label}
                                                    {/* ✅ Navbar badge */}
                                                    {setting.affectsNavbar && (
                                                        <span
                                                            style={{
                                                                fontSize: "10px",
                                                                background:
                                                                    "var(--primary-100)",
                                                                color: "var(--primary-700)",
                                                                borderRadius: "4px",
                                                                padding: "1px 6px",
                                                                marginLeft: "6px",
                                                                fontWeight: "500",
                                                            }}
                                                        >
                                                            Navbar
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="notification-setting-desc">
                                                    {setting.desc}
                                                </div>
                                            </div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    notifSettings[setting.key]
                                                }
                                                onChange={() =>
                                                    handleNotifToggle(setting.key)
                                                }
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div
                                style={{
                                    marginTop: "24px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "var(--gray-500)",
                                    }}
                                >
                                    ✅ Changes apply instantly to navbar
                                </p>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleNotifSave}
                                >
                                    <HiOutlineCheck /> Save Preferences
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;