import User from '../models/UserModel.js';

export const registerUser = async (userData) => {
    return await User.create(userData);
};

export const isEmailExist = async (email) => {
    return await User.findOne({ email });
};
