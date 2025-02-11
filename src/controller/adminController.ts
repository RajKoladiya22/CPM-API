import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import Employee from "../models/employeeModel";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/responseHandler";

export const userList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch superadmins and admins from User table
    const users = await User.find(
      { role: { $in: ["superadmin", "admin"] } },
      "username email role adminId"
    )
      .populate("adminId", "username email role")
      .lean();

    // Fetch users from Employee table
    const employees = await Employee.find({}, "username email role adminId")
      .populate("adminId", "username email role")
      .lean();

    // Group users by role
    const groupedUsers = {
      superadmins: users.filter((user) => user.role === "superadmin"),
      admins: users.filter((user) => user.role === "admin"),
      users: employees, // All employees are considered "users"
    };

    return sendSuccessResponse(
      res,
      200,
      "Users and Employees retrieved successfully",
      groupedUsers
    );
  } catch (error) {
    console.error("Error in userList:", error);
    next(error);
  }
};

export const getUsersByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id =
      req.user?.role === "admin" ? req.user?.userId : req.user?.adminId;
    // Check if the logged-in user is an admin
    if (!id) {
      return sendErrorResponse(res, 403, "Access denied. Admins only.");
    }

    // Fetch users associated with the admin
    const users = await Employee.find({ adminId: id }).select(
      "username email role createdAt updatedAt designation"
    );

    return sendSuccessResponse(res, 200, "Users fetched successfully", users);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

export const deleteUserByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // User ID to be deleted
    const adminId = req.user?.userId; // Admin's ID from authenticated request

    // Check if user exists and belongs to the admin
    const user = await Employee.findOne({ _id: id, adminId });

    if (!user) {
      return sendErrorResponse(res, 404, "User not found or unauthorized.");
    }

    // Delete the user
    await Employee.findByIdAndDelete(id);

    return sendSuccessResponse(res, 200, "User deleted successfully.");
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};
