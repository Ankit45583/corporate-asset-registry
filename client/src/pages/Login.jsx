import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineShieldCheck,
    HiOutlineCube,
    HiOutlineChartBar,
    HiOutlineExclamationCircle,
} from 'react-icons/hi';
import '../styles/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(async () => {
            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="login-page">
            {/* Left Side */}
            <div className="login-left">
                <div className="login-branding">
                    <div className="login-logo">
                        <div className="login-logo-icon">🏢</div>
                        <div className="login-logo-text">AssetHub</div>
                    </div>

                    <h2 className="login-tagline">
                        Manage Your<br />
                        Corporate <span>Assets</span><br />
                        Efficiently
                    </h2>

                    <p className="login-description">
                        Track, manage, and optimize your organization's assets with our
                        comprehensive asset management platform. From procurement to retirement.
                    </p>

                    <div className="login-features">
                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <HiOutlineCube />
                            </div>
                            <span>Complete Asset Lifecycle Management</span>
                        </div>
                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <HiOutlineChartBar />
                            </div>
                            <span>Real-time Analytics & Reporting</span>
                        </div>
                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <HiOutlineShieldCheck />
                            </div>
                            <span>Secure & Role-based Access Control</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="login-right">
                <div className="login-form-container">
                    <div className="login-welcome">
                        <h2>Welcome Back! 👋</h2>
                        <p>Sign in to access your dashboard</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="login-error">
                            <HiOutlineExclamationCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="login-input-wrapper">
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                                <HiOutlineMail className="input-icon" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="login-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <HiOutlineLockClosed className="input-icon" />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                                </button>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="login-options">
                            <label className="remember-me">
                                <input type="checkbox" defaultChecked />
                                Remember me
                            </label>
                            <a href="#" className="forgot-password">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>

                        {/* Register Link */}
                        <div className="login-register-link">
                            Don't have an account?{' '}
                            <Link to="/register">Create Account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;