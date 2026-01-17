const errorHandler = (req, res, next) => {
    const errorResponse = {
        success: false,
        statusCode: statusCode,
        errorCode: matchedError.errorCode,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
    };

    next();
};

export default errorHandler;
