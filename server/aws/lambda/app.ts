import { APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface S3Lambda extends S3Event {
    imageKey?: string;
    file?: Express.Multer.File;
    randomImageName?: string;
}

const s3 = new S3Client({ region: process.env.REGION_NAME });

export const s3_image_uploader = async (event: S3Lambda): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.file || !event.randomImageName) {
            throw new Error('Parametres for uploading to s3 are undefined');
        }

        const bucketName = event.Records[0].s3.bucket.name;

        const uploadParams = {
            Bucket: bucketName,
            Body: event.file.buffer,
            Key: event.randomImageName,
            ContentType: event.file.mimetype,
        };

        const command = new PutObjectCommand(uploadParams);

        const uploadFileResult = await s3.send(command);

        if (!uploadFileResult || uploadFileResult.$metadata.httpStatusCode != 200) {
            throw new Error(
                `There was an issue uploading image to s3 - code: ${uploadFileResult?.$metadata.httpStatusCode}, result:${uploadFileResult} `,
            );
        }

        //const url = `${s3.config.endpoint}/${bucketName}/${event.randomImageName}`;
        //s3_save_image_url_to_dynamo(url);

        return {
            statusCode: 200,
            body: JSON.stringify(event.randomImageName),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `An error happened in the s3_image_uploader - ${err}`,
            }),
        };
    }
};

export const get_s3_image = async (event: S3Lambda): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.imageKey) {
            throw new Error('bucketName or imageKey for downloading from s3 is undefined');
        }

        const bucketName = event.Records[0].s3.bucket.name;

        const command = new GetObjectCommand({
            Key: event.imageKey,
            Bucket: bucketName,
        });

        const imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        if (!imageUrl) {
            throw new Error('Image url path from s3 returned null/undefined');
        }

        return {
            statusCode: 200,
            body: JSON.stringify(imageUrl),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `An error happened in the get_s3_image - ${err}`,
            }),
        };
    }
};
