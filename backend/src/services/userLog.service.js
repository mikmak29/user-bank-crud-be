import UserLogModel from "../models/UserLogModel.js";

export const createLog = async (data) => {
    return await UserLogModel.create(data);
};

export const fetchLogs = async () => {
    return await UserLogModel.find();
};

export const fetchLogByType = async (type) => {
    return await UserLogModel.find({ type });
};

export const fetchLogById = async (userId) => {
    return await UserLogModel.find({ userId });
};

export const deleteLogById = async (userId) => {
    return await UserLogModel.findOneAndDelete({ userId });
};
