// models/LeadAnalysis.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ILeadAnalysis extends Document {
  leadId:     mongoose.Types.ObjectId;
  analysisId: mongoose.Types.ObjectId;
  submittedAt: Date;
  createdAt:   Date;   // ← add
  updatedAt:   Date;   // ← add

}

const LeadAnalysisSchema = new Schema<ILeadAnalysis>(
  {
    leadId:     { type: Schema.Types.ObjectId, ref: "Lead",     required: true },
    analysisId: { type: Schema.Types.ObjectId, ref: "Analysis", required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const LeadAnalysis = mongoose.model<ILeadAnalysis>("LeadAnalysis", LeadAnalysisSchema);