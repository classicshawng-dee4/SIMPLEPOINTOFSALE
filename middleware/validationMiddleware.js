import { body, check, validationResult } from "express-validator";

// Helper function to catch any validation errors and format them cleanly
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // We return the first error message to keep it simple and clean for the frontend
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array()
        });
    }
    next();
};

// 1. Rules for user registration
export const validateRegister = [
    check("name", "Name is required").trim().notEmpty(),
    check("email", "Please provide a valid email address").trim().isEmail().normalizeEmail(),
    check("username", "Username must be at least 3 characters long")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3 }),
    check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
    handleValidationErrors
];

// 2. Rules for user login
export const validateLogin = [
    (req, res, next) => {
        const identifier = req.body?.identifier ?? req.body?.username ?? req.body?.email;
        if (typeof identifier !== "string" || !identifier.trim()) {
            return res.status(400).json({
                success: false,
                message: "Username or email is required",
            });
        }
        next();
    },
    body("password", "Password is required").notEmpty(),
    handleValidationErrors
];