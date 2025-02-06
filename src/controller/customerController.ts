import { Request, Response, NextFunction } from "express";
import Customer from "../models/customerModel";
import AdminCustomField from "../models/customFieldModel";
import { IUser } from "../utils/interfaces";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/responseHandler";

export const addCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      companyName,
      contactPerson,
      mobileNumber,
      email,
      tallySerialNo,
      prime,
      blacklisted,
      remark,
      dynamicFields, // Dynamic fields to be added to the customer
    } = req.body;
    const sanitizedDynamicFields =
      dynamicFields && typeof dynamicFields === "object" ? dynamicFields : {};
    // Fetch the admin's custom fields
    const customFields = await AdminCustomField.find({
      adminId: req.user?.userId,
    });

    // Validate dynamic fields according to admin's custom fields
    const dynamicFieldKeys = Object.keys(dynamicFields);
    for (let key of dynamicFieldKeys) {
      const field = customFields.find((f) => f.fieldName === key);
      if (!field) {
        return sendErrorResponse(
          res,
          400,
          `Field '${key}' is not a valid custom field for your admin.`
        );
      }
    }

    const newCustomer = new Customer({
      companyName,
      contactPerson,
      mobileNumber,
      email,
      tallySerialNo,
      remark,
      prime,
      blacklisted,
      adminId: req.user?.userId, // Save the admin's ID who is creating the customer
      dynamicFields: sanitizedDynamicFields, // Store the dynamic fields
    });

    await newCustomer.save();
    return sendSuccessResponse(
      res,
      201,
      "Customer added successfully",
      newCustomer
    );
  } catch (error: any) {
    console.log(error);
    
    // Check for duplicate key error (code 11000)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return sendErrorResponse(
        res,
        400,
        `The email '${error.keyValue.email}' is already in use.`
      );
    }
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

export const searchCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { companyName, mobileNumber, contactPerson, tallySerialNo } = req.query;

  const id = req.user?.role === "admin" ? req.user?.userId : req.user?.adminId;

  const query: any = { adminId: id }; // Add the adminId filter to the query

  if (companyName) query.companyName = { $regex: companyName, $options: "i" };
  if (tallySerialNo)
    query.tallySerialNo = { $regex: tallySerialNo, $options: "i" };
  if (mobileNumber)
    query.mobileNumber = { $regex: mobileNumber, $options: "i" };
  if (contactPerson)
    query.contactPerson = { $regex: contactPerson, $options: "i" };

  try {
    const customers = await Customer.find(query);

    if (customers.length === 0) {
      return sendErrorResponse(res, 404, "No customers found!");
    }

    return sendSuccessResponse(res, 200, "Customers found", customers);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params; // Get customer ID from route parameter
  const updates = req.body; // Get the fields to be updated from the request body
  const adminId = req.user?.userId; // The logged-in admin's ID

  // Check if the user is an admin
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Only admins can update customer data" });
  }

  try {
    // Find the customer by ID and check if it belongs to the current admin
    const customer: any = await Customer.findOne({ _id: id, adminId: adminId });

    if (!customer) {
      res
        .status(404)
        .json({ message: "Customer not found or not authorized to update" });
    }

    // Update the customer fields
    Object.assign(customer, updates);
    await customer.save();

    // Send the updated customer data in response
    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer,
    });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      sendErrorResponse(
        res,
        400,
        `The email '${error.keyValue.email}' is already in use.`
      );
    }
    sendErrorResponse(res, 500, "Internal Server Error");
    // Pass errors to the error handler middleware
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params; // Get customer ID from route parameter
  const adminId = req.user?.userId; // The logged-in admin's ID

  // Check if the user is an admin
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Only admins can delete customer data" });
  }

  try {
    // Find the customer by ID and check if it belongs to the current admin
    const customer = await Customer.findOneAndDelete({
      _id: id,
      adminId: adminId,
    });

    if (!customer) {
      res
        .status(404)
        .json({ message: "Customer not found or not authorized to delete" });
    }

    // Send success message
    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};
