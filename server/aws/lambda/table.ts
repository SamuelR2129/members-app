import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { utcToZonedTime } from 'date-fns-tz';

const dynamoDBClient = new DynamoDBClient({ region: process.env.REGION_NAME });

export const get_table_data = async (event: APIGatewayProxyEvent) => {
    try {
        const previousDaysAndWeek = event?.queryStringParameters?.previousDaysAndWeek;

        if (!previousDaysAndWeek) {
            throw new Error('Missing previousDaysAndWeek in query parameters');
        }

        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME,
            FilterExpression: '#createdAt BETWEEN :pastDate AND :currentDay',
            ExpressionAttributeNames: {
                '#createdAt': 'createdAt',
            },
            ExpressionAttributeValues: marshall({
                ':pastDate': previousDaysAndWeek,
                ':currentDay': utcToZonedTime(new Date(), 'Australia/Sydney').toISOString(),
            }),
        };

        // Execute the scan command to retrieve data from DynamoDB
        const data = await dynamoDBClient.send(new ScanCommand(params));

        // Process the retrieved data as needed
        const items = data?.Items?.map((item) => {
            return unmarshall(item); // Convert DynamoDB item to a JavaScript object
        });

        // Return a response
        return {
            statusCode: 200,
            body: JSON.stringify(items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
