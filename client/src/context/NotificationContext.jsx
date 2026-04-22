import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  // ─── Settings State ───────────────────────────────────────────
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("notification_settings");
      return saved
        ? JSON.parse(saved)
        : {
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

  // ─── All Notifications (unfiltered raw data) ──────────────────
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // ─── Time ago helper ──────────────────────────────────────────
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

  // ─── Fetch from API ───────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const [assetRes, empRes, assignRes] = await Promise.all([
        api.get("/assets"),
        api.get("/employees"),
        api.get("/assignments"),
      ]);

      const raw = [];
      let id = 1;

      // Asset type notifications
      assignRes.data.slice(0, 3).forEach((assign) => {
        raw.push({
          id: id++,
          type: "asset",
          variant: "success",
          title: "Asset Assigned",
          message: `${assign.asset?.name || "Asset"} assigned to ${
            assign.employee?.name || "Employee"
          }`,
          time: getTimeAgo(assign.assignDate),
          read: false,
          icon: "🔗",
        });
      });

      // Maintenance type notifications
      assetRes.data
        .filter((a) => a.status === "maintenance")
        .slice(0, 2)
        .forEach((asset) => {
          raw.push({
            id: id++,
            type: "maintenance",
            variant: "warning",
            title: "Maintenance Required",
            message: `${asset.name} is under maintenance`,
            time: getTimeAgo(asset.updatedAt),
            read: false,
            icon: "🔧",
          });
        });

      // Retired = asset type
      assetRes.data
        .filter((a) => a.status === "retired")
        .slice(0, 2)
        .forEach((asset) => {
          raw.push({
            id: id++,
            type: "asset",
            variant: "danger",
            title: "Asset Retired",
            message: `${asset.name} marked as retired`,
            time: getTimeAgo(asset.updatedAt),
            read: true,
            icon: "📦",
          });
        });

      // Report type notifications
      raw.push({
        id: id++,
        type: "report",
        variant: "info",
        title: "Report Ready",
        message: "Monthly asset report is ready to download",
        time: "Today",
        read: true,
        icon: "📊",
      });

      // Employee = asset type (info)
      empRes.data.slice(0, 2).forEach((emp) => {
        raw.push({
          id: id++,
          type: "asset",
          variant: "info",
          title: "Employee Added",
          message: `${emp.name} joined ${emp.department || "the team"}`,
          time: getTimeAgo(emp.createdAt),
          read: true,
          icon: "👤",
        });
      });

      const availableCount = assetRes.data.filter(
        (a) => a.status === "available"
      ).length;
      if (availableCount > 0) {
        raw.push({
          id: id++,
          type: "asset",
          variant: "info",
          title: "Assets Available",
          message: `${availableCount} assets available for assignment`,
          time: "Now",
          read: true,
          icon: "✅",
        });
      }

      setAllNotifications(raw);
    } catch (err) {
      console.error("Notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch on mount ───────────────────────────────────────────
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Filtered notifications based on settings ─────────────────
  const notifications = (() => {
    // pushNotif OFF → koi notification nahi
    if (!settings.pushNotif) return [];

    return allNotifications.filter((notif) => {
      if (notif.type === "asset" && !settings.assetAlerts) return false;
      if (notif.type === "maintenance" && !settings.maintenanceAlerts)
        return false;
      if (notif.type === "report" && !settings.reportAlerts) return false;
      return true;
    });
  })();

  // ─── Unread count ─────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.read).length;

  // ─── Actions ──────────────────────────────────────────────────
  const markAsRead = useCallback((id) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setAllNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setAllNotifications([]);
  }, []);

  // ─── Settings actions ─────────────────────────────────────────
  const toggleSetting = useCallback((key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("notification_settings", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("notification_settings", JSON.stringify(newSettings));
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
    localStorage.setItem("notification_settings", JSON.stringify(defaults));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        settings,
        loading,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllRead,
        clearNotifications,
        toggleSetting,
        saveSettings,
        resetSettings,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};