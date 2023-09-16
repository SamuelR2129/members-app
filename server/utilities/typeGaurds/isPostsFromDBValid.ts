import { DynamoDb } from '../../types';

export const isPostsFromDBValid = (unknownData: DynamoDb | unknown): unknownData is DynamoDb => {
    const postsFromDB = unknownData as DynamoDb;
    return (
        postsFromDB &&
        postsFromDB.LastEvaluatedKey !== undefined &&
        postsFromDB.Items !== undefined &&
        Array.isArray(postsFromDB.Items) &&
        typeof postsFromDB[0]._id &&
        typeof postsFromDB[0].buildSite === 'string' &&
        typeof postsFromDB[0].createdAt &&
        typeof postsFromDB[0].name === 'string' &&
        typeof postsFromDB[0].report === 'string'
    );
};
