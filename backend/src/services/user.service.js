import User from '../models/UserModel.js';

export const registerUser = async (userData) => {
    return await User.create(userData);
};

export const loginUser = async (userEmail) => {
    return await User.findOne({ email: userEmail });
};

export const updateUser = async (userId, data, isNew) => {
    return await User.findOneAndUpdate({ _id: userId }, data, { new: isNew });
};

export const isEmailExist = async (email) => {
    return await User.findOne({ email });
};

export const isIdExist = async (userId) => {
    return await User.findOne({ _id: userId });
};

export const lastLoginUser = async (userId) => {
    return await User.updateOne({ _id: userId }, { lastLogin: new Date() });
};
