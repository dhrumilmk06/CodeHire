/**
 * Global Error Handling Middleware
 */

export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    
    // Log the error
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR ${statusCode} - ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        code: statusCode
    });
};

