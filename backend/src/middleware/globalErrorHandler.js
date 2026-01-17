import STATUS_CODES from "../constants/STATUS_CODE.js";

const globalErrorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    const matchedError = STATUS_CODES[statusCode];

    const errorFound = {
        success: false,
        statusCode: statusCode,
        errorCode: matchedError.errorCode,
    };

    res.status(200).json(errorFound);
};

export default globalErrorHandler;
