import * as dotenv from "dotenv";
dotenv.config();
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION || "";
const accessKeyId = process.env.AWS_ACCESS_KEY || "";
const secretAccessKey = process.env.AWS_SECRET_KEY || "";

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  region,
});

export const uploadFileS3 = async (
  file: Express.Multer.File,
  randomImageName: string
) => {
  try {
    if (!bucketName) {
      console.error("bucketName for uploading to s3 is undefined");
      return;
    }

    const uploadParams = {
      Bucket: bucketName,
      Body: file.buffer,
      Key: randomImageName,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);

    const uploadFileResult = await s3.send(command);

    if (!uploadFileResult || uploadFileResult.$metadata.httpStatusCode != 200) {
      console.error(
        `There was an issue uploading image to s3 - code: ${uploadFileResult?.$metadata.httpStatusCode}, result:${uploadFileResult} `
      );
    }
    return uploadFileResult;
  } catch (err) {
    throw err;
  }
};

export const getFilesFromS3 = async (imageName: string) => {
  if (!bucketName) {
    console.error("bucketName for downloading tfrom s3 is undefined");
    return;
  }
  try {
    const command = new GetObjectCommand({
      Key: imageName,
      Bucket: bucketName,
    });

    const fileUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    if (!fileUrl) {
      console.error("Image url path from s3 returned null/undefined");
      return;
    }
    return fileUrl;
  } catch (err) {
    throw err;
  }
};

export const deleteFileFromS3 = async (imageName: string) => {
  try {
    const command = new DeleteObjectCommand({
      Key: imageName,
      Bucket: bucketName,
    });

    const response = await s3.send(command);

    if (!response || response.$metadata.httpStatusCode != 204) {
      throw new Error(
        `There was an issue deleting image at s3 - code: ${response?.$metadata.httpStatusCode}, result:${response} `
      );
    }

    return response;
  } catch (err) {
    throw err;
  }
};
