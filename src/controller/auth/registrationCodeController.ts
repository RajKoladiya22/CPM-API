import { Request, Response, NextFunction } from "express";
import Code from "../../models/auth/registretioncodeModel";
import { AppError } from "../../utils/AppError";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/responseHandler";

// Unified API for generating registration codes
export const createRegistrationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const { username, designation, expiryDate } = req.body;
    // console.log({ username, designation, expiryDate })
    // console.log("userId",userId)
    // console.log("userRole",userRole)
    let assignedToRole: string | null = null;

    // Super Admin can create Admin codes with expiry date
    if (userRole === "superadmin") {
      assignedToRole = "admin";
      if (!expiryDate) {
        return sendErrorResponse(res, 400, "Expiry date is required for admin code.");
      }
    } 
    // Admin can create codes for Subadmin or Employee
    else if (userRole === "admin") {
      if (designation) {
        assignedToRole = "employee"; // If designation exists, it's for Employee
      } else {
        assignedToRole = "subadmin"; // Default is Subadmin if no designation
      }
    } 
    else {
      return sendErrorResponse(res, 403, "Unauthorized to generate codes.");
    }

    // Ensure designation is provided for employees
    if (assignedToRole === "employee" && !designation) {
      return sendErrorResponse(res, 400, "Designation is required for employees.");
    }

    // Generate a unique registration code
    const code = Math.random().toString(36).substring(2, 15);

    // Create the registration code entry
    const registrationCode = new Code({
      username,
      code,
      createdBy: userId,
      assignedToRole,
      designation: assignedToRole === "employee" ? designation : undefined,
      expiresAt: assignedToRole === "admin" ? new Date(expiryDate) : undefined, // Only add expiry date for Admin codes
    });

    await registrationCode.save();

    return sendSuccessResponse(
      res,
      201,
      `${assignedToRole} registration code created successfully.`,
      { code, assignedToRole }
    );
  } catch (error) {
    console.error("Error in Code:", error);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};
