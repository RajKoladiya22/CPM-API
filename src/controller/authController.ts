import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/userModel";
import Employee from "../models/employeeModel";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/responseHandler";
import { generateToken, verifyToken } from "../utils/jwtUtils";
import { sendEmail } from "../utils/emailService"; // Utility to send emails

// Temporary token storage (Use Redis or Database in production)
const blacklistedTokens = new Set<string>();

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendErrorResponse(res, 400, "Email and password are required!");
  }

  try {
    // Try finding the user in both User and Employee collections
    let user: any = await User.findOne({ email });

    if (!user) {
      user = await Employee.findOne({ email });
      if (!user) {
        return sendErrorResponse(res, 404, "User not found!");
      }
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendErrorResponse(res, 401, "Invalid credentials!");
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(
      user._id.toString(),
      user.role,
      user.adminId?.toString() || null // Handle cases where adminId might be undefined
    );

    return sendSuccessResponse(res, 200, "Login successful!", {
      token,
      user: {
        id: user._id,
        username: user.username || user.name, // Handle different field names
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};


//  Logout API (Token Blacklisting)
export const logoutUser = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return sendErrorResponse(res, 400, "No token provided.");
  }

  blacklistedTokens.add(token); // Add token to blacklist (Consider Redis for real-world apps)
  return sendSuccessResponse(res, 200, "Logout successful!");
};

//  Forgot Password API (Send Reset Link via Email)
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!email) {
    return sendErrorResponse(res, 400, "Email is required!");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 404, "User not found!");
    }

    // Generate a password reset token (valid for 15 minutes)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiration
    await user.save();

    // Send reset email
    const resetUrl = `http://yourfrontend.com/reset-password/${resetToken}`;
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Click here to reset your password: ${resetUrl}`
    );

    return sendSuccessResponse(
      res,
      200,
      "Password reset link sent to your email!"
    );
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error");
  }
};

//  Reset Password API (After User Clicks Reset Link)
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return sendErrorResponse(res, 400, "Token and new password are required!");
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }, // Check if token is still valid
    });

    if (!user) {
      return sendErrorResponse(res, 400, "Invalid or expired reset token!");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return sendSuccessResponse(res, 200, "Password reset successful!");
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error");
  }
};
