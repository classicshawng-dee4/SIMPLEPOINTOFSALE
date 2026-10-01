import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utility/generateToken.js';

const jwtSecretMissingResponse = (res) => {
    if (process.env.JWT_SECRET) return false;

    return res.status(503).json({
        success: false,
        message: 'Authentication is not configured. Add JWT_SECRET to the project .env file.',
    });
};

export const registerUser = async (req, res) => {
    const configurationError = jwtSecretMissingResponse(res);
    if (configurationError) return configurationError;

    try {
        const { name, email, username, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username?.trim().toLowerCase();
        const duplicateConditions = [{ email: normalizedEmail }];
        if (normalizedUsername) duplicateConditions.push({ username: normalizedUsername });

        const userExists = await User.findOne({ $or: duplicateConditions });
        if (userExists) {
            return res.status(409).json({ success: false, message: 'Email or username is already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            ...(normalizedUsername && { username: normalizedUsername }),
            password: hashedPassword,
            role: 'Cashier'
        });

        return res.status(201).json({
            success: true, message: 'User registered successfully',
            data: { _id: user.id, name: user.name, email: user.email, username: user.username, role: user.role, token: generateToken(user._id) }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Email or username is already in use' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: 'Server Error: Unable to register user' });
    }
};

export const loginUser = async (req, res) => {
    const configurationError = jwtSecretMissingResponse(res);
    if (configurationError) return configurationError;

    try {
        const identifier = (req.body.identifier ?? req.body.username ?? req.body.email).trim().toLowerCase();
        const { password } = req.body;
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            return res.status(200).json({
                success: true, message: 'Login successful',
                data: { _id: user.id, name: user.name, email: user.email, username: user.username, role: user.role, token: generateToken(user._id) }
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login failed:', error.message);
        return res.status(500).json({ success: false, message: 'Server Error: Unable to login' });
    }
};