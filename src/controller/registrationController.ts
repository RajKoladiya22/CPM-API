import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { IUser } from "../utils/interfaces";
import User from "../models/userModel";
import Employee from "../models/employeeModel";
import Code from "../models/registretioncodeModel";
import { AppError } from "../utils/AppError";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/responseHandler";
import { generateToken } from "../utils/jwtUtils";

export const registerWithCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, registrationCode } = req.body;

  if (!username) {
    return sendErrorResponse(res, 400, "User Name is required!");
  }
  if (!registrationCode) {
    return sendErrorResponse(res, 400, "Registration code is required!");
  }

  try {
  
    const code = await Code.findOne({ code: registrationCode });
    if (!code) {
      return sendErrorResponse(res, 400, "Invalid or expired registration code.");
    }

    // if (code.used) {
    //   return sendErrorResponse(res, 400, "This registration code has already been used.");
    // }

    // Fetch the role of the user who created this code
    const creator = await User.findById(code.createdBy);
    if (!creator) {
      return sendErrorResponse(res, 400, "Invalid creator of this registration code.");
    }

    let newUser;

    if (creator.role === "admin") {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return sendErrorResponse(res, 400, "User with this email already exists.");
      }

      // Save as an Employee and assign designation
      newUser = new Employee({
        username,
        email,
        password,
        designation: code.designation || "Employee", // Assign designation dynamically
        role: code.role,
        adminId: code.createdBy,
        registrationCode: code.code,
      });
    } else if (creator.role === "superadmin") {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return sendErrorResponse(res, 400, "User with this email already exists.");
      }

      // Save as a User
      newUser = new User({
        username,
        email,
        password,
        role: code.role,
        adminId: code.createdBy,
        registrationCode: code.code,
      });
    } else {
      return sendErrorResponse(res, 400, "Invalid role in registration code.");
    }

    await newUser.save();

    // Mark the code as used
    code.used = true;
    await code.save();

    return sendSuccessResponse(res, 201, "User registered successfully!", {
      username,
      email,
      role: newUser.role,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return next(new AppError(errorMessages.join(", "), 400));
    }

    next(new AppError("Internal Server Error", 500));
  }
};

