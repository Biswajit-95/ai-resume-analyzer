
// import { Schema, model, Document, Types } from "mongoose";

// export interface AnalysisDocument extends Document {
//   leadId: Types.ObjectId;

//   resumeUrl: string;
//   resumeHash: string;

//   extractedText: string;

//   atsScore: number;
//   hirabilityIndex: number;
//   interviewChance: number;

//   strengths: string[];
//   weaknesses: string[];
//   missingKeywords: string[];
//   improvementSuggestions: string[];

//   createdAt: Date;
//   updatedAt: Date;
// }

// const AnalysisSchema = new Schema<AnalysisDocument>(
//   {
//     leadId: {
//       type: Schema.Types.ObjectId,
//       ref: "Lead",
//       required: true,
//       index: true,
//     },

//     resumeUrl: {
//       type: String,
//       required: true,
//     },

//     // used to prevent duplicate AI analysis
//     resumeHash: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },

//     extractedText: {
//       type: String,
//       required: true,
//     },

//     atsScore: {
//       type: Number,
//       required: true,
//     },

//     hirabilityIndex: {
//       type: Number,
//       required: true,
//     },

//     interviewChance: {
//       type: Number,
//       required: true,
//     },

//     strengths: {
//       type: [String],
//       default: [],
//     },

//     weaknesses: {
//       type: [String],
//       default: [],
//     },

//     missingKeywords: {
//       type: [String],
//       default: [],
//     },

//     improvementSuggestions: {
//       type: [String],
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// export const Analysis = model<AnalysisDocument>("Analysis", AnalysisSchema);

// models/Analysis.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IAnalysis extends Document {
  resumeHash:             string;
  resumeUrl:              string;
  extractedText:          string;
  modelVersion:           string;
  atsScore:               number;
  hirabilityIndex:        number;
  interviewChance:        number;
  strengths:              string[];
  weaknesses:             string[];
  missingKeywords:        string[];
  improvementSuggestions: string[];
  createdAt:              Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    resumeHash:             { type: String, required: true, unique: true, index: true },
    resumeUrl:              { type: String, required: true },
    extractedText:          { type: String, required: true },
    modelVersion:           { type: String, required: true },
    atsScore:               { type: Number, required: true },
    hirabilityIndex:        { type: Number, required: true },
    interviewChance:        { type: Number, required: true },
    strengths:              [String],
    weaknesses:             [String],
    missingKeywords:        [String],
    improvementSuggestions: [String],
  },
  { timestamps: true }
);

export const Analysis = mongoose.model<IAnalysis>("Analysis", AnalysisSchema);