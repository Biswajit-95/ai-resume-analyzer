
import { Request, Response }   from "express";
import mongoose                from "mongoose";
import { Lead }                from "../models/Lead";
import { AppError, ErrorCode } from "../errors/AppError";

// types/populated.ts or inline
import { ILead }         from "../models/Lead";
import { ILeadAnalysis } from "../models/LeadAnalysis";
import { IAnalysis }     from "../models/Analysis";

type PopulatedLead = Omit<ILead, "leadAnalysisId"> & {
  leadAnalysisId: Omit<ILeadAnalysis, "analysisId"> & {
    analysisId: IAnalysis;
  } | null;
};

// ─────────────────────────────────────────
// GET /leads
// ─────────────────────────────────────────
export const getAllLeads = async (req: Request, res: Response) => {
  const leads = await Lead.find()
    .populate({
      path:   "leadAnalysisId",
      select: "-__v",
      populate: {
        path:   "analysisId",
        select: "-__v -extractedText",
      },
    })
    .sort({ createdAt: -1 })
    .lean() as unknown as PopulatedLead[];

  const formatted = leads.map((lead) => ({
    id:        lead._id,
    name:      lead.name,
    email:     lead.email,
    phone:     lead.phone,
    resumeUrl: lead.resumeUrl,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
    analysis:  lead.leadAnalysisId?.analysisId ?? null,
  }));

  return res.json({ leads: formatted });
};

// ─────────────────────────────────────────
// GET /leads/:id
// ─────────────────────────────────────────
export const getLeadById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid lead ID", 400);
  }

  const lead = await Lead.findById(id)
    .populate({
      path:   "leadAnalysisId",
      select: "-__v",
      populate: {
        path:   "analysisId",
        select: "-__v -extractedText",
      },
    })
    .lean() as unknown as PopulatedLead | null;

  if (!lead) {
    throw new AppError(ErrorCode.NOT_FOUND, "Lead not found", 404);
  }

  return res.json({
    lead: {
      id:        lead._id,
      name:      lead.name,
      email:     lead.email,
      phone:     lead.phone,
      resumeUrl: lead.resumeUrl,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      analysis:  lead.leadAnalysisId?.analysisId ?? null,
    },
  });
};