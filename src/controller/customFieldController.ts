import { Request, Response, NextFunction } from "express";
import AdminCustomField from "../models/customFieldModel";
import { sendSuccessResponse, sendErrorResponse } from "../utils/responseHandler";


export const addCustomField = async (req: Request, res: Response, next: NextFunction) => {
  const { fieldName, fieldType, isRequired } = req.body;

  if (!fieldName || !fieldType) {
    return sendErrorResponse(res, 400, "Field name and type are required!");
  }

  const newCustomField = new AdminCustomField({
    adminId: req.user?.userId,  // Admin adding the custom field
    fieldName,
    fieldType,
    isRequired,
  });

  try {
    await newCustomField.save();
    return sendSuccessResponse(res, 201, "Custom field added successfully", newCustomField);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};


export const getCustomFields = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customFields = await AdminCustomField.find({ adminId: req.user?.userId });
      
      return sendSuccessResponse(res, 200, "Custom fields fetched successfully", customFields);
    } catch (error) {
      console.error(error);
      return sendErrorResponse(res, 500, "Internal Server Error");
    }
  };
  