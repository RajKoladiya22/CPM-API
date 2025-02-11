// import { GoogleSpreadsheet } from "google-spreadsheet";
// import { JWT } from "google-auth-library";
// import dotenv from "dotenv";

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



import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

// const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
// const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const SPREADSHEET_ID =
  process.env.SPREADSHEET_ID || "15N5Byfqb6Z3FY1dLUu6n5FAyaldbwA25vVPt2cDNtc4"; // Your Google Sheet ID
const SERVICE_ACCOUNT_EMAIL =
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
  "google-sheets-service-account@customer-cpm.iam.gserviceaccount.com";
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
  throw new Error("Missing Google Sheets credentials in environment variables");
}

// Create a new JWT client for authentication
const authClient = new JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(SPREADSHEET_ID, authClient);

const authenticateGoogleSheets = async () => {
  try {
    await doc.loadInfo(); // Ensure the document metadata is loaded
    console.log("Connected to Google Sheets");
  } catch (error) {
    console.error("Error authenticating with Google Sheets:", error);
  }
};

// Function to add customer data to Google Sheets
export const addCustomerToSheet = async (customerData: any) => {
  try {
    await authenticateGoogleSheets();
    const sheet = doc.sheetsByIndex[0]; // Select the first sheet
    await sheet.addRow(customerData);
    console.log("Customer added to Google Sheets");
  } catch (error) {
    console.error("Error adding customer to Google Sheets:", error);
  }
};
