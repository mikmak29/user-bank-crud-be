const authHeader = async (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(404).json("Not authorized.");
    }

    next();
};