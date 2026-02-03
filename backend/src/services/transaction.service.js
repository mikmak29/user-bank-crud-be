import Transaction from "../models/TransactionModel.js";

export const createData = async (data) => {
	return await Transaction.create(data);
};

export const depositHandler = async (userId, updateData) => {
	return await Transaction.findOneAndUpdate({ userId }, updateData, { upsert: true, new: true });
};

export const withdrawalHandler = async (userId, updateData) => {
	return await Transaction.findOneAndUpdate({ userId }, updateData, { new: true });
};

export const transferHandler = async (userId, updateData) => {
	return await Transaction.findOneAndUpdate({ userId }, updateData, { new: true });
};

export const transferReceiverHandler = async (userId, updateData) => {
	return await Transaction.findOneAndUpdate({ userId }, updateData, { new: true });
};

export const inquiryBalanceHandler = async (userId) => {
	return await Transaction.findOne({ userId });
};

export const userAccount = async (userId) => {
	return await Transaction.findOne({ userId });
};

export const receiverAccount = async (owner) => {
	return await Transaction.findOne({ owner });
};
