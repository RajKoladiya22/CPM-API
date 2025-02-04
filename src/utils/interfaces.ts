// interfaces.ts
import mongoose, { Schema, Document } from "mongoose";

// 1. IUser Interface for the User Model
export interface IUser extends Document {
  username: string | null;
  email: string;
  password: string;
  role: string | "admin" | "user" | "superadmin"; // You can add more roles if needed
  adminId: mongoose.Types.ObjectId;
  registrationCode: string;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  resetPasswordToken?: String | null;
  resetPasswordExpires?: Date | null;
  comparePassword(candidatePassword: string): Promise<boolean>; // Method to compare password
}

export interface ICode extends Document {
  username: string;
  code: string; // The actual registration code
  createdBy: mongoose.Types.ObjectId; // The ID of the user (super admin or admin) who created the code
  role: string; // Role that the code is used for: 'admin' or 'user'
  used: boolean; // Whether the code has been used or not
}

// 2. IErrorResponse Interface for Standardized Error Response
export interface IErrorResponse {
  status: "error";
  message: string;
  statusCode: number;
  error?: any; // Can store any extra error information
}

// 3. IGenericResponse Interface for Standard API Response Format
export interface IGenericResponse<T = any> {
  status: "success" | "fail";
  message: string;
  data?: T; // Optional to send data along with the response
  error?: IErrorResponse; // Optional error information if status is 'fail'
}

// 4. ITokenPayload Interface for JWT Token Payload (example)
export interface ITokenPayload {
  userId: string;
  username: string;
  role: "admin" | "user" | "moderator"; // You can adjust roles
  iat: number; // JWT issue timestamp
  exp: number; // JWT expiration timestamp
}

// 6. IDatabaseConfig Interface (for MongoDB connection string and configuration)
export interface IDatabaseConfig {
  uri: string;
  options?: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    useCreateIndex?: boolean;
    useFindAndModify?: boolean;
  };
}

// 7. ILoginRequest Interface (for login data)
export interface ILoginRequest {
  email: string;
  password: string;
}

// 8. IRegisterRequest Interface (for registration data)
export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin" | "moderator";
}
