import * as z from "zod";

const userSchema = z.object({
    username: z.string({ error: "Username is required." }).min(5).max(30),
    email: z.email().min(8).max(30),
    password: z.string().min(9).max(20),
    country: z.string().min(2).max(56),
    work_experience: z.object({
        frontend: z.array(z.string()).nullish(),
        backend: z.array(z.string()).nullish(),
        database: z.array(z.string()).nullish()
    }),
    isWFHType: z.boolean()
});

export default userSchema;
