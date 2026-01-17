const STATUS_CODES = {
    400: {
        errorCode: "BAD_REQUEST",
    },
    401: {
        errorCode: "UNAUTHORIZED",
    },
    403: {
        errorCode: "FORBIDDEN",
    },
    404: {
        errorCode: "NOT_FOUND",
    },
    409: {
        errorCode: "CONFLICT",
    },
    500: {
        errorCode: "INTERNAL_SERVER_ERROR",
    },
};

export default STATUS_CODES;
