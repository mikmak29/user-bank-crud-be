import Transaction from "../models/TransactionModel.js";

export const createData = async (data) => {
    return await Transaction.create(data);
};

export const depositHandler = async (userEmail, updateData) => {
    return await Transaction.findOneAndUpdate(
        { owner: userEmail },
        updateData,
        { upsert: true, new: true }
    );
};

export const withdrawalHandler = async (userEmail, updateData) => {
    return await Transaction.findOneAndUpdate(
        { owner: userEmail },
        updateData,
        { new: true }
    );
};

export const transferHandler = async (userEmail, updateData) => {
    return await Transaction.findOneAndUpdate({ owner: userEmail },
        updateData,
        { new: true }
    );
};

export const transferReceiverHandler = async (userEmail, updateData) => {
    return await Transaction.findOneAndUpdate({ owner: userEmail },
        updateData,
        { new: true }
    );
};

export const inquiryBalanceHandler = async (userEmail) => {
    return await Transaction.findOne({ owner: userEmail });
};

export const ownerShip = async (userEmail) => {
    return await Transaction.findOne({ owner: userEmail });
};
