
import { Router }       from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getAllLeads, getLeadById } from "../controllers/leadController";

const router = Router();

router.get("/",asyncHandler(getAllLeads));
router.get("/:id", asyncHandler(getLeadById));

export default router;
