import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        const error = new Error('JWT_SECRET is not configured in the .env file');
        error.code = 'JWT_SECRET_MISSING';
        throw error;
    }

    return jwt.sign({ id }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
};

export default generateToken;