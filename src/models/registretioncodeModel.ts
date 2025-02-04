// codeModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import {ICode} from '../utils/interfaces'


const codeSchema: Schema<ICode> = new Schema(
  {
    code: { type: String, required: true, unique: true },
    username: {type: String, required: true},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the code
    role: {
      type: String,
      enum: ['admin', 'user', 'superadmin'],
      required: true,
    },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Code = mongoose.model<ICode>('Code', codeSchema);

export default Code;
