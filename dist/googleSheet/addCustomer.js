"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCustomerInSheeet = void 0;
const googleSheetsHelper_1 = require("./googleSheetsHelper");
const customerModel_1 = __importDefault(require("../models/customer/customerModel"));
const responseHandler_1 = require("../utils/responseHandler");
const addCustomerInSheeet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { companyName, contactPerson, mobileNumber, email, tallySerialNo, prime, blacklisted, remark, dynamicFields } = req.body;
        const newCustomer = new customerModel_1.default({
            companyName,
            contactPerson,
            mobileNumber,
            email,
            tallySerialNo,
            remark,
            prime,
            blacklisted,
            adminId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            dynamicFields
        });
        yield newCustomer.save();
        // Send data to Google Sheets
        yield (0, googleSheetsHelper_1.addCustomerToSheet)({
            Company: companyName,
            "Contact Person": contactPerson,
            "Mobile Number": mobileNumber,
            Email: email,
            "Tally Serial No": tallySerialNo,
            Prime: prime ? "Yes" : "No",
            Blacklisted: blacklisted ? "Yes" : "No",
            Remark: remark,
        });
        return (0, responseHandler_1.sendSuccessResponse)(res, 201, "Customer added successfully", newCustomer);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.addCustomerInSheeet = addCustomerInSheeet;
