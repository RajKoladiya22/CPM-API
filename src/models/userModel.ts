import mongoose, { Schema, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../utils/interfaces";

// Define the user schema
const userSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'username is require'],
      unique: false,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "superadmin"],
      default: "user", // Default role is 'user'
    },
    adminId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    registrationCode: { type: String, default: null },
    lastLogin: {
      type: Date,
      default: null, // Last login can be null initially
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Hash the password before saving the user document
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // If password is not modified, proceed
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(this.password, salt); // Hash the password
    this.password = hashedPassword; // Assign the hashed password
    next(); // Proceed with saving the user
  } catch (error) {
    next(error as CallbackError);
  }
});

// Method to compare password with hashed password in the database
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
