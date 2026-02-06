import { DEFAULT_ROUTE } from "../constants/ROUTES.js";

const { default_url } = DEFAULT_ROUTE;

const redirectURL = (req, res, next) => {
	if (req.url) {
		return res.redirect(default_url);
	}
};

export default redirectURL;
