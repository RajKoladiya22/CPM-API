"use strict";
// import { GoogleSpreadsheet } from "google-spreadsheet";
// import { JWT } from "google-auth-library";
// import dotenv from "dotenv";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCustomerToSheet = void 0;
// dotenv.config();
// const SPREADSHEET_ID =
//   process.env.SPREADSHEET_ID || "15N5Byfqb6Z3FY1dLUu6n5FAyaldbwA25vVPt2cDNtc4"; // Your Google Sheet ID
// const SERVICE_ACCOUNT_EMAIL =
//   process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
//   "google-sheets-service-account@customer-cpm.iam.gserviceaccount.com";
// const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
// if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
//   throw new Error("Missing Google Sheets credentials in environment variables");
// }
// // Authenticate using Google Auth Library
// const authClient = new JWT({
//   email: SERVICE_ACCOUNT_EMAIL,
//   key: PRIVATE_KEY,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });
// // Create Google Spreadsheet instance with authentication
// const doc = new GoogleSpreadsheet(SPREADSHEET_ID, authClient);
// export const addCustomerToSheet = async (customerData: any) => {
//   try {
//     await doc.loadInfo(); // Load spreadsheet details
//     const sheet = doc.sheetsByIndex[0]; // Use first sheet
//     await sheet.addRow(customerData);
//     console.log("Customer added to Google Sheets");
//   } catch (error) {
//     console.error("Error adding customer to Google Sheets:", error);
//   }
// };
const google_spreadsheet_1 = require("google-spreadsheet");
const google_auth_library_1 = require("google-auth-library");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
// const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "15N5Byfqb6Z3FY1dLUu6n5FAyaldbwA25vVPt2cDNtc4"; // Your Google Sheet ID
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    "google-sheets-service-account@customer-cpm.iam.gserviceaccount.com";
const PRIVATE_KEY = (_a = process.env.GOOGLE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n");
if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error("Missing Google Sheets credentials in environment variables");
}
// Create a new JWT client for authentication
const authClient = new google_auth_library_1.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const doc = new google_spreadsheet_1.GoogleSpreadsheet(SPREADSHEET_ID, authClient);
const authenticateGoogleSheets = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield doc.loadInfo(); // Ensure the document metadata is loaded
        console.log("Connected to Google Sheets");
    }
    catch (error) {
        console.error("Error authenticating with Google Sheets:", error);
    }
});
// Function to add customer data to Google Sheets
const addCustomerToSheet = (customerData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield authenticateGoogleSheets();
        const sheet = doc.sheetsByIndex[0]; // Select the first sheet
        yield sheet.addRow(customerData);
        console.log("Customer added to Google Sheets");
    }
    catch (error) {
        console.error("Error adding customer to Google Sheets:", error);
    }
});
exports.addCustomerToSheet = addCustomerToSheet;
