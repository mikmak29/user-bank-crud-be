export const DEFAULT_ROUTE = {
	default_url: "/api/user/userData",
};

export const USER_ROUTE = {
	register: "/register",
	login: "/login",
	refreshToken: "/refreshToken",
	userData: "/userData",
	update: "/update/:id",
};

export const TRANS_ROUTE = {
	deposit: "/deposit",
	withdraw: "/withdraw",
	transfer: "/transfer",
};

export const USERLOG_ROUTE = {
	admin: "/admin",
	current: "/current/admin",
	user: "/user/:id",
	del: "/del/:id",
};
