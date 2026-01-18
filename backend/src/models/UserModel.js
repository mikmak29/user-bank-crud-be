import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
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
        work_experience: {
            frontend: {
                type: [String],
            },
            backend: {
                type: [String],
            },
            database: {
                type: [String],
            },
        },
        isWFHType: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.models.User || mongoose.model("User", userSchema, "prac12_users");
