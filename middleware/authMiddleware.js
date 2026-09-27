import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 1. Protect routes (Requires valid login token)
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user and exclude password
            req.user = await User.findById(decoded.id).select("-password");

            // Catch cases where token is valid but user was removed from DB
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User account not found"
                });
            }

            return next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed or expired"
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided"
        });
    }
};

// 2. Admin authorization (Requires 'Admin' role)
export const admin = (req, res, next) => {
    // Case-insensitive comparison prevents casing mismatches ('Admin' vs 'admin')
    if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied: Admin privileges required"
        });
    }
};