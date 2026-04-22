import { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('car_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    // ✅ Register
    const register = async (name, email, password) => {
        try {
            const data = await registerUser(name, email, password);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // ✅ Login
    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            const userData = {
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                avatar: data.avatar,
                token: data.token
            };
            setUser(userData);
            localStorage.setItem('car_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // ✅ Update user
    // ✅ updateUser mein phone, department etc bhi save karo
const updateUser = (data) => {
    const updated = { 
        ...user, 
        ...data,
        // ✅ Token update karo agar naya aaya
        token: data.token || user.token
    };
    
    // ✅ Avatar update karo agar name badla
    if (data.name) {
        const parts = data.name.trim().split(' ');
        updated.avatar = parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : data.name.slice(0, 2).toUpperCase();
    }
    
    setUser(updated);
    localStorage.setItem('car_user', JSON.stringify(updated));
};

    // ✅ Logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('car_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};