import { IUser } from "../../utils/interfaces";
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "admin", "subadmin", "employee"], required: true },
    adminId: { type: Schema.Types.ObjectId, ref: "User", default: null }, // Admin who created this user
    subAdminId: { type: Schema.Types.ObjectId, ref: "User", default: null }, // Sub-admin who manages this employee
    designation: { type: String, default: null }, // Optional for employees
    renewDate: { type: Date, default: null },
    lastLogin: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null, index: true },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// 🔹 Indexing for faster queries
UserSchema.index({ email: 1 }, { unique: true }); // Optimize email-based lookups
UserSchema.index({ role: 1, adminId: 1 }); // Optimize admin-level queries
UserSchema.index({ role: 1, subAdminId: 1 }); // Optimize sub-admin to employee relations

// 🔹 Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Compare hashed passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

