const errorHandler = (errorMessage, statusCode, filePath) => {
    const error = new Error(errorMessage);
    error.statusCode = statusCode;
    error.filePath = filePath;
    throw error;
};

export default errorHandler;
