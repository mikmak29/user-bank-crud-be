const ResponseHandler = (res, success, statusCode, details = {}) => {
    return res.status(statusCode).json({
        success: success,
        statusCode: statusCode,
        details,
    });
};

export default ResponseHandler;
