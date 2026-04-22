import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineUser,
    HiOutlineShieldCheck,
    HiOutlineCube,
    HiOutlineChartBar,
    HiOutlineExclamationCircle,
    HiOutlineCheck,
} from 'react-icons/hi';
import '../styles/login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on type
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Password strength checker
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const levels = [
            { strength: 0, label: '', color: '' },
            { strength: 1, label: 'Weak', color: 'var(--danger)' },
            { strength: 2, label: 'Fair', color: 'var(--warning)' },
            { strength: 3, label: 'Good', color: 'var(--info)' },
            { strength: 4, label: 'Strong', color: 'var(--success)' },
            { strength: 5, label: 'Very Strong', color: 'var(--success)' },
        ];

        return levels[strength];
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
        const result = await register(
            formData.name,
            formData.email,
            formData.password
        );

        console.log('Result:', result);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setErrors({ email: result.message });
        }
    } catch (err) {
        console.log('Submit error:', err);
    } finally {
        setLoading(false);
    }
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
                        Join <span>AssetHub</span><br /> & Take Control<br /> of Your Assets
                    </h2>
                    <p className="login-description"> Register to start managing your corporate assets efficiently.
                        Track, assign, and monitor all assets in one place. </p>
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
                            <span>Secure Role-based Access Control</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="login-right">
                <div className="login-form-container">
                    {success ? (
                        <div className="register-success">
                            <div className="register-success-icon">
                                <HiOutlineCheck />
                            </div>
                            <h3>Account Created!</h3>
                            <p>Redirecting to login page...</p>
                        </div>
                    ) : (
                        <>
                            <div className="login-welcome">
                                <h2>Create Account ✨</h2>
                                <p>Fill in your details to get started</p>
                            </div>

                            <form className="login-form" onSubmit={handleSubmit}>
                                {/* Full Name */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <div className="login-input-wrapper">
                                        <input
                                            type="text"
                                            name="name"
                                            className={`form-input ${errors.name ? 'error' : ''}`}
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                        />
                                        <HiOutlineUser className="input-icon" />
                                    </div>
                                    {errors.name && (
                                        <div className="form-error">
                                            <HiOutlineExclamationCircle /> {errors.name}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Email Address <span className="required">*</span>
                                    </label>
                                    <div className="login-input-wrapper">
                                        <input
                                            type="email"
                                            name="email"
                                            className={`form-input ${errors.email ? 'error' : ''}`}
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                        />
                                        <HiOutlineMail className="input-icon" />
                                    </div>
                                    {errors.email && (
                                        <div className="form-error">
                                            <HiOutlineExclamationCircle /> {errors.email}
                                        </div>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Password <span className="required">*</span>
                                    </label>
                                    <div className="login-input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            className={`form-input ${errors.password ? 'error' : ''}`}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Min. 6 characters"
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
                                    {errors.password && (
                                        <div className="form-error">
                                            <HiOutlineExclamationCircle /> {errors.password}
                                        </div>
                                    )}

                                    {/* Password Strength Bar */}
                                    {formData.password && (
                                        <div className="password-strength">
                                            <div className="password-strength-bars">
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <div
                                                        key={level}
                                                        className="password-strength-bar"
                                                        style={{background: level <= passwordStrength.strength ? passwordStrength.color : 'var(--gray-200)',
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            {passwordStrength.label && (
                                                <span className="password-strength-label"
                                                    style={{ color: passwordStrength.color }}
                                                >
                                                    {passwordStrength.label}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Confirm Password <span className="required">*</span>
                                    </label>
                                    <div className="login-input-wrapper">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            name="confirmPassword"
                                            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Re-enter your password"
                                        />
                                        <HiOutlineLockClosed className="input-icon" />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                        >
                                            {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div className="form-error">
                                            <HiOutlineExclamationCircle /> {errors.confirmPassword}
                                        </div>
                                    )}

                                    {/* Match indicator */}
                                    {formData.confirmPassword &&
                                        formData.password === formData.confirmPassword && (
                                            <div
                                                className="form-error"
                                                style={{ color: 'var(--success)' }}
                                            >
                                                <HiOutlineCheck /> Passwords match!
                                            </div>
                                        )}
                                </div>
                                <button
                                    type="submit"
                                    className="login-btn"
                                    disabled={loading}
                                    style={{ marginTop: '8px' }}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account →'}
                                </button>
                                <div className="login-register-link">
                                    Already have an account?{' '}
                                    <Link to="/login">Sign In</Link>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;