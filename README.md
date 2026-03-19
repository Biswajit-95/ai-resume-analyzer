# AI Resume Analyzer Backend

A Node.js + Express + TypeScript backend for an AI-powered resume analyzer SaaS.

## Features

- Lead capture + MongoDB storage
- Resume upload (PDF/DOCX) → Cloudflare R2
- Text extraction using `pdf-parse` and `mammoth`
- AI analysis using Google Gemini (or compatible LLM API)
- Structured JSON output validated with Zod
- Business score caps enforced
- Result storage in MongoDB
- Email reports via Resend

## Getting Started

1. Copy `.env.example` to `.env` and fill in your credentials.
2. Install dependencies:

```bash
npm install
```

3. Run in development:

```bash
npm run dev
```

## API Endpoints

- `POST /lead` – create a new lead
- `POST /upload-resume` – upload resume file (form-data: `resume`, body: `leadId`)
- `POST /analyze-resume` – run analysis for a lead
- `GET /analysis/:id` – fetch analysis result

## Notes

- The Gemini integration expects the API to return a JSON-only response. If your provider returns other formatting, adjust `src/services/aiService.ts` accordingly.
- R2 upload/download is implemented using the AWS SDK with a custom endpoint.
