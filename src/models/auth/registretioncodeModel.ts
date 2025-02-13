// codeModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import {ICode} from '../../utils/interfaces'


const codeSchema: Schema<ICode> = new Schema(
  {
    code: { type: String, required: true, unique: true },
    username: {type: String, required: true},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    assignedToRole: { type: String, enum: ["admin", "subadmin", "employee"], required: true },
    expiresAt: { type: Date, required: false },
    designation: { type: String, required: false },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Code = mongoose.model<ICode>('Code', codeSchema);

export default Code;
