import mongoose, { Schema, Document } from "mongoose";
import { IProduct, ICustomer } from "../../utils/interfaces";

const productSchema = new Schema<IProduct>(
  {
    productName: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    renewalDate: { type: Date },
    details: { type: String },
    reference: { type: Boolean, default: false },
    referenceDetail: {
      referenceId: { type: Schema.Types.ObjectId, ref: "User", required: false },
      referenceName: { type: String, required: false },
      referenceContact: { type: String, required: false },
      remark: { type: String, required: false },
    },
  },
  { _id: false }
);

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
    products: { type: [productSchema], default: [] },
    dynamicFields: { 
      type: Map, 
      of: Schema.Types.Mixed, 
      default: () => new Map(), // Ensures it is always initialized
    },
  },
  { timestamps: true }
);

// 🔹 Indexing for Fast Searching
customerSchema.index({ adminId: 1 }); // Fetching customers under an admin
customerSchema.index({ "products.renewalDate": 1 }); // Fast lookup for renewals
customerSchema.index({ "products.referenceDetail.referenceId": 1 }); // Fast lookup by reference (subadmin)
customerSchema.index({ "products.productName": 1 }); // Fast lookup by product name
customerSchema.index({ mobileNumber: 1 }); // Fast search by mobile number
customerSchema.index({
  companyName: "text",
  contactPerson: "text",
  mobileNumber: "text",
  email: "text",
}); // Full-text search support

// 🔹 Auto-fill Reference Details if Missing
// customerSchema.pre("save", function (next) {
//   if (this.products) {
//     this.products.forEach((product: any) => {
//       if (!product.referenceDetail.referenceId) {
//         if (!product.referenceDetail.referenceName || !product.referenceDetail.referenceContact) {
//           return next(new Error("Reference details must be filled manually if no referenceId is provided."));
//         }
//       }
//     });
//   }

//   if (this.dynamicFields) {
//     for (const [key, value] of this.dynamicFields.entries()) {
//       if (typeof value === "undefined") {
//         this.dynamicFields.set(key, false);
//       }
//     }
//   }
  
//   next();
// });

const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
export default Customer;
