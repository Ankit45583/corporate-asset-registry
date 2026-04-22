import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Employees from './pages/Employees';
import Assignments from './pages/Assignments';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import './styles/global.css';
import './styles/layout.css';

const AppLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="layout">
            <Sidebar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />
            <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                <Navbar
                    onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                    onToggleMobile={() => setMobileOpen(!mobileOpen)}
                />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/assignments" element={<Assignments />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </div>
    );
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
                path="/register"
                element={user ? <Navigate to="/" /> : <Register />}
            />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                {/* ✅ NotificationProvider AuthProvider ke andar */}
                <NotificationProvider>
                    <AppRoutes />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#1F2937',
                                color: '#fff',
                                borderRadius: '10px',
                                padding: '14px 20px',
                                fontSize: '14px',
                                fontWeight: '500',
                            },
                        }}
                    />
                </NotificationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;