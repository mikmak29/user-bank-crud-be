import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        email: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['pending', 'deposit', 'withdrawal', 'transfer'],
            default: 'pending',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        transferTo: {
            type: String
        },
        transferredFrom: {
            type: String
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'cancelled'],
            default: 'pending'
        },
        reference_id: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.models.UserLogs || mongoose.model("UserLogs", userLogSchema, "prac12_userlogs");
