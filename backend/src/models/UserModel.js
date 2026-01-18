import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        lastLogin: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.models.User || mongoose.model("User", userSchema, "prac12_users");
