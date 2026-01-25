import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        owner: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['pending', 'deposit', 'withdrawal', 'transfer'],
            required: true
        },
        current_balance: {
            type: Number,
            required: true,
            min: 0
        },
        transferTo: {
            type: String,
        },
        currency: {
            type: String,
            enum: ["PesoToPeso", "PesoToDollar", "DollarToPeso"],
            default: "PesoToPeso",
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'cancelled'],
            default: 'pending'
        },
        reference_id: {
            type: String,
            unique: true,
            sparse: true // allows null values while maintaining uniqueness
        },
        // Balance after this transaction (optional but useful)
        balance_after: {
            type: Number
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
        versionKey: false
    }
);

// Indexes for better query performance
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ account_id: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });

export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema, "prac12_transactions");
