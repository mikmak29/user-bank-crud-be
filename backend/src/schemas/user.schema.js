import * as z from "zod";

const userSchema = z.object({
    email: z.email().max(30),
    password: z.string().min(9).max(20),
    country: z.string().min(2).max(56),
});

export default userSchema;
