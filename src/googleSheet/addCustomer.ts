import { Request, Response, NextFunction } from "express";
import { addCustomerToSheet } from "./googleSheetsHelper";
import Customer  from "../models/customerModel";
import {
    sendSuccessResponse,
    sendErrorResponse,
  } from "../utils/responseHandler";

export const addCustomerInSheeet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyName, contactPerson, mobileNumber, email, tallySerialNo, prime, blacklisted, remark, dynamicFields } = req.body;

    const newCustomer = new Customer({
      companyName,
      contactPerson,
      mobileNumber,
      email,
      tallySerialNo,
      remark,
      prime,
      blacklisted,
      adminId: req.user?.userId,
      dynamicFields
    });

    await newCustomer.save();

    // Send data to Google Sheets
    await addCustomerToSheet({
      Company: companyName,
      "Contact Person": contactPerson,
      "Mobile Number": mobileNumber,
      Email: email,
      "Tally Serial No": tallySerialNo,
      Prime: prime ? "Yes" : "No",
      Blacklisted: blacklisted ? "Yes" : "No",
      Remark: remark,
    });

    return sendSuccessResponse(res, 201, "Customer added successfully", newCustomer);
  } catch (error: any) {
    console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};
