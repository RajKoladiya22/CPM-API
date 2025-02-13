import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { IUser } from "../../utils/interfaces";
import User from "../../models/auth/userModel";
import Code from "../../models/auth/registretioncodeModel";
import { AppError } from "../../utils/AppError";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/responseHandler";
import { generateToken } from "../../utils/jwtUtils";

export const registerWithCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, registrationCode } = req.body;

  // Basic validation
  if (!username) {
    return sendErrorResponse(res, 400, "User Name is required!");
  }
  if (!registrationCode) {
    return sendErrorResponse(res, 400, "Registration code is required!");
  }

  try {
    // Check if the registration code is valid and exists in the DB
    const code = await Code.findOne({ code: registrationCode });
    if (!code) {
      return sendErrorResponse(res, 400, "Invalid or expired registration code.");
    }
    if(code.used == true){
      return sendErrorResponse(res, 400, "Registration code has been used.");
    }

    // Fetch the creator details to understand the user's role
    const creator = await User.findById(code.createdBy);
    if (!creator) {
      return sendErrorResponse(res, 400, "Invalid creator of this registration code.");
    }

    // Check if the user already exists (to prevent duplicates)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(res, 400, "User with this email already exists.");
    }

    // Create the new user based on the role of the creator
    let newUser: IUser;
    if (creator.role === "admin") {
      // Assign designation if the role is employee
      newUser = new User({
        username,
        email,
        password,
        role: code.assignedToRole || "employee", // Default to employee role
        adminId: code.createdBy,
        designation: code.designation || null,
        registrationCode: code.code,
      });
    } else if (creator.role === "superadmin") {
      // Superadmins can create other users directly
      newUser = new User({
        username,
        email,
        password,
        role: code.assignedToRole,
        adminId: code.createdBy,
        registrationCode: code.code,
        renewDate:code.expiresAt
      });
    } else {
      return sendErrorResponse(res, 400, "Invalid role in registration code.");
    }

    // Encrypt the password
    newUser.password = await bcrypt.hash(newUser.password, 10);

    // Save the user
    await newUser.save();

    // Mark the registration code as used
    code.used = true;
    await code.save();

    // Generate a JWT token for the new user
    // const token = generateToken(newUser._id, newUser.role);

    // Send a successful response
    return sendSuccessResponse(res, 201, "User registered successfully!", {
      username,
      email,
      role: newUser.role,
      // token,
    });
  } catch (error:any) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return next(new AppError(errorMessages.join(", "), 400));
    }

    next(new AppError("Internal Server Error", 500));
  }
};
