import * as dotenv from "dotenv";
dotenv.config();
import { createReadStream } from "fs";
import S3 from "aws-sdk/clients/s3";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
export const uploadFileS3 = (file: Express.Multer.File) => {
  const fileStream = createReadStream(file.path);

  if (!bucketName) {
    console.error("bucketName for uploading to s3 is undefined");
    return;
  }

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

// downloads a file from s3
function getFileStream(fileKey: string) {
  if (!bucketName) {
    console.error("bucketName for downloading tfrom s3 is undefined");
    return;
  }
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}
