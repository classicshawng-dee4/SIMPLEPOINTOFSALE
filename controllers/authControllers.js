import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utility/generateToken.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({
            name, email, password: hashedPassword, role: role || 'Cashier'
        });
        
        return res.status(201).json({
            success: true, message: 'User registered successfully',
            data: { _id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error: Unable to register user' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        
        if (user && (await bcrypt.compare(password, user.password))) {
            return res.status(200).json({
                success: true, message: 'Login successful',
                data: { _id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) }
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error: Unable to login' });
    }
};