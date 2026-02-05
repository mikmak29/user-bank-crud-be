import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["Admin", "Manager", "Client"],
			required: true,
		},
		isActive: {
			type: Boolean,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

userSchema.index({ email: 1, createdAt: -1 });

export default mongoose.models.User || mongoose.model("User", userSchema, "prac12_users");
