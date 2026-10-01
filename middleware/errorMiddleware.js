// Catch requests to routes that don't exist
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
    // If the status code is still 200 but an error was thrown, default to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Something went wrong',
        data: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};