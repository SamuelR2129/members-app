"use strict";
exports.__esModule = true;
exports.isPostsFromDBValid = void 0;
var isPostsFromDBValid = function (unknownData) {
    var postsFromDB = unknownData;
    return (postsFromDB &&
        postsFromDB.LastEvaluatedKey !== undefined &&
        postsFromDB.Items !== undefined &&
        Array.isArray(postsFromDB.Items) &&
        typeof postsFromDB[0]._id &&
        typeof postsFromDB[0].buildSite === 'string' &&
        typeof postsFromDB[0].createdAt &&
        typeof postsFromDB[0].name === 'string' &&
        typeof postsFromDB[0].report === 'string');
};
exports.isPostsFromDBValid = isPostsFromDBValid;
