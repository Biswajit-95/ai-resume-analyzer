import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const extractTextFromBuffer = async (
  buffer: Buffer,
  mimeType: string
): Promise<string> => {

  let extractedText = "";

  try {

    // Handle PDF
    if (mimeType === "application/pdf") {
      const data = await pdfParse(buffer);
      extractedText = data.text || "";
    }

    // Handle DOCX / DOC
    else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    }

    else {
      throw new Error("Unsupported resume format");
    }

  } catch (error) {
    console.error("Resume text extraction failed:", error);
    throw new Error("Failed to extract resume text");
  }

  // Clean text before sending to AI
  return cleanResumeText(extractedText);
};



/**
 * Normalize resume text
 * This improves AI understanding significantly
 */
const cleanResumeText = (text: string): string => {

  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\n{2,}/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();

};