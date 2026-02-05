import { rateLimit } from "express-rate-limit";

const rateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	limit: 10,
});

export default rateLimiter;
