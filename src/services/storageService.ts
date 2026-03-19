
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { buffer } from "stream/consumers";
import dotenv from "dotenv";

dotenv.config();

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env;

if (
  !R2_ACCOUNT_ID ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET_NAME
) {
  throw new Error("Missing R2 environment variables");
}

/**
 * R2 client
 */
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // REQUIRED for Cloudflare R2
});
// const s3 = new S3Client({
//   region: "auto",
//   endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: R2_ACCESS_KEY_ID,
//     secretAccessKey: R2_SECRET_ACCESS_KEY,
//   },
// });

/**
 * Upload file to R2
 */
export const uploadToR2 = async (
  fileBuffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> => {
  const key = `resumes/${Date.now()}-${filename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ContentDisposition: "inline",
    })
  );

  return key;
};

/**
 * Download file from R2
 */
export const downloadFromR2 = async (key: string): Promise<Buffer> => {
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error("Failed to download object from R2");
  }

  return await buffer(response.Body as any);
};