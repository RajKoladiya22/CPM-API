import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import Code from "../models/registretioncodeModel";
import { AppError } from "../utils/AppError";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/responseHandler";

export const createAdminRegistrationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const superAdminId = req.user?.userId;
    const {username} = req.body

    // Ensure the user is a super admin
    if (req.user?.role !== "superadmin") {
      return sendErrorResponse(
        res,
        403,
        "Only super admins can generate admin registration codes."
      );
    }

    const code = Math.random().toString(36).substring(2, 15); // Generate a random code

    // Create a registration code for an admin
    const registrationCode = new Code({
      username,
      code,
      createdBy: superAdminId,
      role: "admin",
    });

    await registrationCode.save();

    return sendSuccessResponse(
      res,
      201,
      "Admin registration code created successfully.",
      { code }
    );
  } catch (error) {
    next(new AppError("Internal Server Error", 500));
  }
};

export const createUserRegistrationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.user?.userId;
    const {username} = req.body
    // Ensure the user is an admin
    if (req.user?.role !== "admin") {
      return sendErrorResponse(
        res,
        403,
        "Only admins can generate user registration codes."
      );
    }

    const code = Math.random().toString(36).substring(2, 15); // Generate a random code

    // Create a registration code for a user
    const registrationCode = new Code({
      username,
      code,
      createdBy: adminId,
      role: "user",
    });

    await registrationCode.save();

    return sendSuccessResponse(
      res,
      201,
      "User registration code created successfully.",
      { code }
    );
  } catch (error) {
    next(new AppError("Internal Server Error", 500));
  }
};


