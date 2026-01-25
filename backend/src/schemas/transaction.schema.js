import * as z from 'zod';

const transactionSchema = z.object({
    type: z.enum(['deposit', 'withdrawal', 'transfer'], {
        errorMap: () => ({ errorMessage: "Invalid transaction." })
    }),
    amount: z.number().positive().min(0),
    currency: z.enum(["PesoToPeso", "PesoToDollar", "DollarToPeso"]).default('PesoToPeso').nullish(),
    status: z.enum(['pending', 'completed', 'failed', 'cancelled']).default('pending'),
    transferTo: z.string().nullish()
});

export default transactionSchema;
