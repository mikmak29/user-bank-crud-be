const NotFoundHandler = ((req, res, next) => {
    return res.status(404).json({
        success: false,
        statusCode: 404,
        errorCode: 'NOT_FOUND',
        details: {
            message: `Cannot ${req.method} at ${req.originalUrl}`,
            path: req.originalUrl
        }
    });
});

export default NotFoundHandler;
