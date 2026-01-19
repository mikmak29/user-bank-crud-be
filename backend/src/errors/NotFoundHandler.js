const NotFoundHandler = ((req, res, next) => {
    return res.status(503).json({
        success: false,
        statusCode: 503,
        errorCode: 'SERVICE_UNAVAILABLE',
        details: {
            message: `Cannot ${req.method} at ${req.originalUrl}`,
            path: req.originalUrl
        }
    });
});

export default NotFoundHandler;
