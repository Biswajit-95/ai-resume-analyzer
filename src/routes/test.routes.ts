// import express from "express";
// import multer from "multer";
// import { extractTextFromBuffer} from "../services/textExtractionService";

// const router = express.Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }
// });

// router.post("/test-extract", upload.single("resume"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // const text = await extractTextFromBuffer(req.file);

//     res.json({
//       message: "Extraction successful",
//       extractedText: text
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       error: "Text extraction failed"
//     });
//   }
// });

// export default router;