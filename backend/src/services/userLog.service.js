import UserLogModel from "../models/UserLogModel.js";

export const createLog = async (data) => {
    return await UserLogModel.create(data);
};

export const fetchLogs = async () => {
    return await UserLogModel.find().sort({ createdAt: -1 });
};

export const fetchLogByType = async (type) => {
    return await UserLogModel.find({ type }).sort({ createdAt: -1 });
};

export const fetchLogById = async (userId) => {
    return await UserLogModel.find({ userId }).sort({ createdAt: -1 });
};

export const deleteLogById = async (objectId, userId) => {
    return await UserLogModel.findOneAndDelete({ _id: objectId, userId });
};

export const ownerShip = async (id, userId) => {
    return await UserLogModel.findOne({ _id: id, userId });
};
