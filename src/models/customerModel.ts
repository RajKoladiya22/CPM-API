import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  adminId: mongoose.Types.ObjectId;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  tallySerialNo: string;
  remark: string;
  prime: boolean;
  blacklisted: boolean;
  dynamicFields: Map<string, any>;
}

const customerSchema: Schema<ICustomer> = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
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
    tallySerialNo: { type: String, required: true },
    prime: { type: Boolean, default: false },
    blacklisted: { type: Boolean, default: false },
    remark: { type: String },
    dynamicFields: { 
      type: Map, 
      of: Schema.Types.Mixed, 
      default: () => new Map() // Ensures it is always initialized
    },
  },
  { timestamps: true }
);

customerSchema.pre("save", function (next) {
  if (this.dynamicFields) {
    for (const [key, value] of this.dynamicFields.entries()) {
      if (typeof value === "undefined") {
        this.dynamicFields.set(key, false);
      }
    }
  }
  next();
});

const Customer = mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;
