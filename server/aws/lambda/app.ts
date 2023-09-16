import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDb } from '../../types';

interface DynamoPost {
    name: string;
    hours: string;
    costs: string;
    report: string;
    buildSite: string;
    imageNames: string[];
    imageUrls: string[];
}

type BodyImage = {
    image: string;
    fileName: string;
    mimeType: string;
};

export const isPostsFromDBValid = (unknownData: DynamoDb | unknown): unknownData is DynamoDb => {
    const postsFromDB = unknownData as DynamoDb;
    return postsFromDB && postsFromDB.Items !== undefined && Array.isArray(postsFromDB.Items);
};

const validDecodedImage = (unknown: unknown): unknown is BodyImage => {
    const decodedImage = unknown as BodyImage;
    return (
        decodedImage !== undefined &&
        decodedImage.image !== undefined &&
        decodedImage.fileName !== undefined &&
        decodedImage.mimeType !== undefined
    );
};

const s3 = new S3Client({ region: process.env.REGION_NAME });

const client = new DynamoDBClient({ region: process.env.REGION_NAME });
const docClient = DynamoDBDocumentClient.from(client);

export const s3_image_uploader = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Starting the s3_image_uploader');

    try {
        const body = event.body ? JSON.parse(event.body) : undefined;

        if (!validDecodedImage(body)) {
            console.error(body);
            throw new Error(`Parametres for uploading to s3 are undefined, ${body}`);
        }

        const decodedImage = Buffer.from(body.image, 'base64');

        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Body: decodedImage,
            Key: body.fileName,
            ContentType: body.mimeType,
        };

        const uploadFileResult = await s3.send(new PutObjectCommand(uploadParams));

        if (!uploadFileResult || uploadFileResult?.$metadata?.httpStatusCode != 200) {
            throw new Error(
                `There was an issue uploading image to s3 - code: ${uploadFileResult?.$metadata.httpStatusCode}`,
            );
        }

        const command = new GetObjectCommand({
            Key: body.fileName,
            Bucket: process.env.S3_BUCKET_NAME,
        });

        const imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        if (!imageUrl) {
            throw new Error('Image url path from s3 returned null/undefined');
        }

        const imageInfo = {
            imageUrl: imageUrl,
            imageNames: body.fileName,
        };

        return {
            statusCode: 200,
            body: JSON.stringify(imageInfo),
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'There was an error saving image to s3' }),
        };
    }
};

export const save_post_to_dynamodb = async (event: APIGatewayProxyEvent) => {
    try {
        console.log('Starting save_post_to_dynamodb');

        const body = event.body ? JSON.parse(event.body) : undefined;

        const command = new PutCommand({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Item: {
                id: uuidv4(),
                name: body.name,
                hours: body.hours,
                costs: body.costs,
                report: body.report,
                buildSite: body.buildSite,
                imageNames: body.imageNames,
                imageUrls: body.imageUrls,
            },
        });

        const response = await docClient.send(command);

        if (response?.$metadata?.httpStatusCode !== 200 || !response?.$metadata?.requestId) {
            throw new Error('Failed to upload post to dynamoDB');
        }

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'There was an error saving post to dynamodb' }),
        };
    }
};

export const get_posts_from_dynamodb = async (event: APIGatewayProxyEvent) => {
    console.log('Starting get_posts_from_dynamodb');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const LastEvaluatedKey = event?.queryStringParameters?.LastEvaluatedKey as unknown as
        | Record<string, any>
        | undefined;

    try {
        const command = new ScanCommand({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Limit: Number(event?.queryStringParameters?.limit) + 1,
            ExclusiveStartKey: LastEvaluatedKey,
        });

        const response = await docClient.send(command);

        if (!isPostsFromDBValid(response)) {
            throw new Error('Getting posts from DB there is a undefined/null value');
        }

        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'There was an error getting posts from dynamodb' }),
        };
    }
};
