const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @route POST /api/auth/register
const register = async (req, res) => {
    try {
        console.log('=== REGISTER CALLED ===');
        console.log('Body:', req.body);
        
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            console.log('Missing fields!');
            return res.status(400).json({ message: 'All fields required' });
        }

        const userExists = await User.findOne({ email });
        
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered!' });
        }

        const parts = name.trim().split(' ');
        const avatar = parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase();

        const user = await User.create({ name, email, password, avatar });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.log('Register error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @route POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
    res.json(req.user);
};

// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, department, designation, location, bio } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) {
            user.name = name;
            const parts = name.trim().split(' ');
            user.avatar = parts.length >= 2
                ? (parts[0][0] + parts[1][0]).toUpperCase()
                : name.slice(0, 2).toUpperCase();
        }

        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (department !== undefined) user.department = department;
        if (designation !== undefined) user.designation = designation;
        if (location !== undefined) user.location = location;
        if (bio !== undefined) user.bio = bio;

        const updated = await user.save();

        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            avatar: updated.avatar,
            phone: updated.phone,
            department: updated.department,
            designation: updated.designation,
            location: updated.location,
            bio: updated.bio,
            token: generateToken(updated._id)
        });

    } catch (error) {
        console.log('UpdateProfile error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// ✅ NEW - @route PUT /api/auth/password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'Current and new password required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters' 
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ Current password verify karo
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Current password is incorrect' 
            });
        }

        // ✅ New password set karo - pre save hook hash karega
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.log('ChangePassword error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// ✅ changePassword export mein add kiya
module.exports = { register, login, getMe, updateProfile, changePassword };