import * as z from 'zod';

const transactionSchema = z.object({
    type: z.enum(['deposit', 'withdrawal'], {
        errorMap: () => ({ errorMessage: "Invalid transaction." })
    }),
    amount: z.number().positive(),
    status: z.enum(['pending', 'completed', 'failed', 'cancelled']).default('pending'),
});

export default transactionSchema;
