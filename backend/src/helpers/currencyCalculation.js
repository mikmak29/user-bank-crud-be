import errorHandler from "../utils/errorHandler.js";
import { FILE_NAME } from "../constants/FILE_NAME.js";

const {
	helpers: { CURRENCY },
} = FILE_NAME;

const currencyCalculationHandler = (amount, currency) => {
	const pesoCurrency = 0.017;
	const dollarCurrecy = 58.97;

	let currencyCalculation = 0;
	let calculatedBalance = 0;

	if (!currency) {
		return errorHandler("No currency type found.", 409, CURRENCY);
	}

	switch (currency) {
		case "PesoToDollar":
			currencyCalculation = amount * pesoCurrency;
			calculatedBalance = `$${currencyCalculation.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
			break;
		case "DollarToPeso":
			currencyCalculation = dollarCurrecy * amount;
			calculatedBalance = `₱${currencyCalculation.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
		default:
			currencyCalculation = amount;
			calculatedBalance = `₱${currencyCalculation.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
			break;
	}

	const data = {
		currency: currency,
		decreasedBalance: currencyCalculation,
		calculatedBalance: calculatedBalance,
	};
	return data;
};

export default currencyCalculationHandler;
