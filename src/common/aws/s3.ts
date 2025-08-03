import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dayjs from "dayjs";
import path from "path";
import config from "config";

const BUCKET_NAME: string = config.get("aws.s3.bucketName");
const REGION: string = config.get("aws.s3.region");
const ACCESS_KEY_ID: string = config.get("aws.s3.accessKeyId");
const SECRET_ACCESS_KEY: string = config.get("aws.s3.secretAccessKey");
const SIGNED_URL_EXPIRATION: number =
  config.get("aws.s3.signedUrlExpiration") || 60;

if (!BUCKET_NAME || !REGION || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error("Missing AWS S3 environment variables");
}

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = dayjs().format("YYYYMMDD-HHmmss");
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext).replace(/\s+/g, "-");
  return `${baseName}-${timestamp}${ext}`;
};

export const uploadFile = async (
  fileBuffer: Buffer,
  originalName: string,
  mimetype: string
): Promise<string> => {
  const fileKey = generateUniqueFileName(originalName);

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  return fileKey;
};

export const deleteFile = async (fileKey: string): Promise<void> => {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
};

export const getSignedUrlForFile = async (
  fileKey: string,
  expiresInSeconds = SIGNED_URL_EXPIRATION
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
};
