import errorHandler from "./errorHandler.js";
import { FILE_NAME } from "../constants/FILE_NAME.js";

const { helpers: { currency_utils } } = FILE_NAME;

const currencyHandler = (amount, type) => {
    const currencyType = type.toLowerCase().trim();
    const currencyBalance = 0;

    if (!currencyType) {
        return errorHandler("No currency type found.", 409, currency_utils);
    }

    switch (currencyType) {
        case 'peso':
            currencyBalance = amount * 58.97;
            break;
        case 'dollar':
            currencyBalance = amount * 0.017;
        default:
            errorHandler("No currency type found.", 409, currency_utils);
            break;
    }

    return currencyBalance;
};

export default currencyHandler;
