const authRole = (...roles) => {
	return (req, res, next) => {
		const data = req.userData;

		if (!data?.role || !roles.includes(data.role)) {
			return res.status(403).json({ message: "Unauthorized or access denied!" });
		}

		req.data = data;
		next();
	};
};

export default authRole;
