import dotenv from 'dotenv';
import mongoose from 'mongoose';
import errorHandler from "../middleware/errorHandler.js";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected successfully at ${mongoose.connection.db.databaseName}`);
    } catch (error) {
        throw errorHandler(error.message, 500, "database.js");
    }
};

export default connectDB;
