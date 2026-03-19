// models/Lead.ts — updated fields
import mongoose, { Schema, Document } from "mongoose";

// models/Lead.ts
export interface ILead extends Document {
  name:           string;
  email:          string;
  phone:          string;
  resumeHash:     string;
  resumeUrl:      string;
  resumeFilename: string;
  resumeMimeType: string;
  leadAnalysisId: mongoose.Types.ObjectId;
  createdAt:      Date;   // ← add this
  updatedAt:      Date;   // ← add this
}

const LeadSchema = new Schema<ILead>(
  {
    name:           { type: String, required: true },
    email:          { type: String, required: true },
    phone:          { type: String, required: true },
    resumeHash:     { type: String, required: true },
    resumeUrl:      { type: String, required: true },
    resumeFilename: { type: String, required: true },
    resumeMimeType: { type: String, required: true },
    leadAnalysisId: { type: Schema.Types.ObjectId, ref: "LeadAnalysis" },
  },
  { timestamps: true }
);

export const Lead = mongoose.model<ILead>("Lead", LeadSchema);