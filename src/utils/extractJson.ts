export const extractJsonFromText = (text: string): string => {
    // Remove markdown code fences
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
  
    // Try direct JSON first
    try {
      JSON.parse(cleaned);
      return cleaned;
    } catch {
      // If not valid, try to extract substring between first { and last }
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
  
      if (start !== -1 && end !== -1 && end > start) {
        const possibleJson = cleaned.slice(start, end + 1);
        JSON.parse(possibleJson); // validate
        return possibleJson;
      }
  
      throw new Error("No valid JSON found in AI response");
    }
  };