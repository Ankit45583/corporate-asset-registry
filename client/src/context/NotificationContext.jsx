import { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    useCallback 
} from "react";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {

    // ─── Settings State ───────────────────────────────────
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem("notification_settings");
            return saved ? JSON.parse(saved) : {
                emailNotif: true,
                pushNotif: true,
                assetAlerts: true,
                maintenanceAlerts: true,
                reportAlerts: false,
                weeklyDigest: true,
            };
        } catch {
            return {
                emailNotif: true,
                pushNotif: true,
                assetAlerts: true,
                maintenanceAlerts: true,
                reportAlerts: false,
                weeklyDigest: true,
            };
        }
    });

    const [allNotifications, setAllNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // ─── Time ago helper ──────────────────────────────────
    const getTimeAgo = (dateStr) => {
        if (!dateStr) return "Recently";
        const now = new Date();
        const date = new Date(dateStr);
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
        return date.toLocaleDateString();
    };

    // ✅ FIX: API calls bilkul nahi
    // Summary data bahar se inject hoga
    const buildNotificationsFromSummary = useCallback((summaryData) => {
        if (!summaryData) return;

        try {
            setLoading(true);
            const raw = [];
            let id = 1;

            // ✅ recentActivity summary me pehle se hai
            if (summaryData.recentActivity?.length > 0) {
                summaryData.recentActivity.forEach((act) => {
                    raw.push({
                        id: id++,
                        type: act.type === 'primary' ? 'asset' 
                            : act.type === 'warning' ? 'maintenance' 
                            : act.type === 'danger' ? 'asset' 
                            : 'asset',
                        variant: act.type === 'primary' ? 'success'
                            : act.type === 'warning' ? 'warning'
                            : act.type === 'danger' ? 'danger'
                            : 'info',
                        title: act.type === 'primary' ? 'Asset Assigned'
                            : act.type === 'warning' ? 'Maintenance Required'
                            : act.type === 'danger' ? 'Asset Retired'
                            : 'Update',
                        message: act.text.replace(/<[^>]*>/g, ''),
                        time: act.time,
                        read: false,
                        icon: act.type === 'primary' ? '🔗'
                            : act.type === 'warning' ? '🔧'
                            : act.type === 'danger' ? '📦'
                            : '✅',
                    });
                });
            }

            // ✅ Maintenance count summary se
            if (summaryData.maintenanceCount > 0) {
                raw.push({
                    id: id++,
                    type: 'maintenance',
                    variant: 'warning',
                    title: 'Maintenance Required',
                    message: `${summaryData.maintenanceCount} asset(s) under maintenance`,
                    time: 'Now',
                    read: false,
                    icon: '🔧',
                });
            }

            // ✅ Available assets summary se
            if (summaryData.availableCount > 0) {
                raw.push({
                    id: id++,
                    type: 'asset',
                    variant: 'info',
                    title: 'Assets Available',
                    message: `${summaryData.availableCount} assets available for assignment`,
                    time: 'Now',
                    read: true,
                    icon: '✅',
                });
            }

            // ✅ Retired count summary se
            if (summaryData.retiredCount > 0) {
                raw.push({
                    id: id++,
                    type: 'asset',
                    variant: 'danger',
                    title: 'Assets Retired',
                    message: `${summaryData.retiredCount} asset(s) marked as retired`,
                    time: 'Now',
                    read: true,
                    icon: '📦',
                });
            }

            // Static report notification
            raw.push({
                id: id++,
                type: 'report',
                variant: 'info',
                title: 'Report Ready',
                message: 'Monthly asset report is ready to download',
                time: 'Today',
                read: true,
                icon: '📊',
            });

            setAllNotifications(raw);
        } catch (err) {
            console.error("Notification build error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Ye function Dashboard call karega
    // Koi extra API call nahi hogi
    const fetchNotifications = useCallback((summaryData) => {
        buildNotificationsFromSummary(summaryData);
    }, [buildNotificationsFromSummary]);

    // ─── Filtered notifications ───────────────────────────
    const notifications = (() => {
        if (!settings.pushNotif) return [];
        return allNotifications.filter((notif) => {
            if (notif.type === "asset" && !settings.assetAlerts) 
                return false;
            if (notif.type === "maintenance" && !settings.maintenanceAlerts) 
                return false;
            if (notif.type === "report" && !settings.reportAlerts) 
                return false;
            return true;
        });
    })();

    const unreadCount = notifications.filter((n) => !n.read).length;

    // ─── Actions ──────────────────────────────────────────
    const markAsRead = useCallback((id) => {
        setAllNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllRead = useCallback(() => {
        setAllNotifications((prev) => 
            prev.map((n) => ({ ...n, read: true }))
        );
    }, []);

    const clearNotifications = useCallback(() => {
        setAllNotifications([]);
    }, []);

    // ─── Settings actions ─────────────────────────────────
    const toggleSetting = useCallback((key) => {
        setSettings((prev) => {
            const updated = { ...prev, [key]: !prev[key] };
            localStorage.setItem(
                "notification_settings", 
                JSON.stringify(updated)
            );
            return updated;
        });
    }, []);

    const saveSettings = useCallback((newSettings) => {
        setSettings(newSettings);
        localStorage.setItem(
            "notification_settings", 
            JSON.stringify(newSettings)
        );
    }, []);

    const resetSettings = useCallback(() => {
        const defaults = {
            emailNotif: true,
            pushNotif: true,
            assetAlerts: true,
            maintenanceAlerts: true,
            reportAlerts: false,
            weeklyDigest: true,
        };
        setSettings(defaults);
        localStorage.setItem(
            "notification_settings", 
            JSON.stringify(defaults)
        );
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            settings,
            loading,
            unreadCount,
            fetchNotifications,  // ✅ Ab ye summaryData leta hai
            markAsRead,
            markAllRead,
            clearNotifications,
            toggleSetting,
            saveSettings,
            resetSettings,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};