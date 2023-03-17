import * as dotenv from "dotenv";
dotenv.config();
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Logger } from "mongodb";

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
    const getObjectParams = {
      Key: imageName,
      Bucket: bucketName,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    if (!url) {
      console.error("Image url path from s3 returned null/undefined");
      return;
    }
    return url;
  } catch (err) {
    throw err;
  }
};
