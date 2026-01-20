import Transaction from "../models/TransactionModel.js";

export const depositHandler = async (data) => {
    return await Transaction.create(data);
};

export const withdrawalHandler = async (data) => {
    return await Transaction.create(data);
};

export const inquiryBalanceHandler = async (userEmail) => {
    return await Transaction.findOne({ owner: userEmail });
};

export const currentBalance = async (userEmail) => {
    return await Transaction.findOne({ owner: userEmail });
};

export const deletePreviousData = async (userEmail) => {
    return await Transaction.deleteOne({ owner: userEmail });
};
