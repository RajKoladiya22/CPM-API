import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  adminId: mongoose.Types.ObjectId;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  tallySerialNo: string;
  remark: string;
  dynamicFields: Map<string, any>;
}

const customerSchema: Schema<ICustomer> = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User",  required: true },
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    tallySerialNo: { type: String, required: true },
    remark: { type: String },
    dynamicFields: { type: Map, of: Schema.Types.Mixed }, 
  },
  { timestamps: true }
);

const Customer = mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;
