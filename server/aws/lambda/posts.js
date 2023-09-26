"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.update_post_in_dynamodb = exports.delete_post_from_dynamodb = exports.get_posts_from_dynamodb = exports.save_post_to_dynamodb = exports.s3_image_uploader = exports.isPostBodyValid = exports.isPostsFromDBValid = void 0;
var client_s3_1 = require("@aws-sdk/client-s3");
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var uuid_1 = require("uuid");
var date_fns_tz_1 = require("date-fns-tz");
var isPostsFromDBValid = function (unknownData) {
    var postsFromDB = unknownData;
    return postsFromDB && postsFromDB.Items !== undefined && Array.isArray(postsFromDB.Items);
};
exports.isPostsFromDBValid = isPostsFromDBValid;
var isPostBodyValid = function (unknown) {
    var body = unknown;
    return (body &&
        body.name !== undefined &&
        body.costs !== undefined &&
        body.hours !== undefined &&
        body.report !== undefined);
};
exports.isPostBodyValid = isPostBodyValid;
var validDecodedImage = function (unknown) {
    var decodedImage = unknown;
    return (decodedImage !== undefined &&
        decodedImage.image !== undefined &&
        decodedImage.fileName !== undefined &&
        decodedImage.mimeType !== undefined);
};
var s3 = new client_s3_1.S3Client({ region: process.env.REGION_NAME });
var client = new client_dynamodb_1.DynamoDBClient({ region: process.env.REGION_NAME });
var docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
var s3_image_uploader = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, decodedImage, uploadParams, uploadFileResult, command, imageUrl, imageInfo, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Starting the s3_image_uploader');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                body = event.body ? JSON.parse(event.body) : undefined;
                if (!validDecodedImage(body)) {
                    console.error(body);
                    throw new Error("Parametres for uploading to s3 are undefined, ".concat(body));
                }
                decodedImage = Buffer.from(body.image, 'base64');
                uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Body: decodedImage,
                    Key: body.fileName,
                    ContentType: body.mimeType
                };
                return [4 /*yield*/, s3.send(new client_s3_1.PutObjectCommand(uploadParams))];
            case 2:
                uploadFileResult = _b.sent();
                if (!uploadFileResult || ((_a = uploadFileResult === null || uploadFileResult === void 0 ? void 0 : uploadFileResult.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) != 200) {
                    throw new Error("There was an issue uploading image to s3 - code: ".concat(uploadFileResult === null || uploadFileResult === void 0 ? void 0 : uploadFileResult.$metadata.httpStatusCode));
                }
                command = new client_s3_1.GetObjectCommand({
                    Key: body.fileName,
                    Bucket: process.env.S3_BUCKET_NAME
                });
                return [4 /*yield*/, (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 })];
            case 3:
                imageUrl = _b.sent();
                if (!imageUrl) {
                    throw new Error('Image url path from s3 returned null/undefined');
                }
                imageInfo = {
                    imageUrl: imageUrl,
                    imageNames: body.fileName
                };
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify(imageInfo)
                    }];
            case 4:
                err_1 = _b.sent();
                console.error('Error:', err_1);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: 'There was an error saving image to s3' })
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.s3_image_uploader = s3_image_uploader;
var save_post_to_dynamodb = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, command, response, err_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                console.log('Starting save_post_to_dynamodb');
                body = event.body ? JSON.parse(event.body) : undefined;
                if (!(0, exports.isPostBodyValid)(body)) {
                    throw new Error('The body to create a post is missing information');
                }
                command = new lib_dynamodb_1.PutCommand({
                    TableName: process.env.DYNAMO_TABLE_NAME,
                    Item: {
                        id: (0, uuid_1.v4)(),
                        name: body.name,
                        hours: body.hours,
                        costs: body.costs,
                        report: body.report,
                        buildSite: body.buildSite,
                        imageNames: body.imageNames || [],
                        imageUrls: body.imageUrls || [],
                        createdAt: (0, date_fns_tz_1.utcToZonedTime)(new Date(), 'Australia/Sydney').toISOString()
                    }
                });
                return [4 /*yield*/, docClient.send(command)];
            case 1:
                response = _c.sent();
                if (((_a = response === null || response === void 0 ? void 0 : response.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) !== 200 || !((_b = response === null || response === void 0 ? void 0 : response.$metadata) === null || _b === void 0 ? void 0 : _b.requestId)) {
                    throw new Error('Failed to upload post to dynamoDB');
                }
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify(response)
                    }];
            case 2:
                err_2 = _c.sent();
                console.error('Error:', err_2);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: 'There was an error saving post to dynamodb' })
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.save_post_to_dynamodb = save_post_to_dynamodb;
var get_posts_from_dynamodb = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var LastEvaluatedKey, command, response, err_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('Starting get_posts_from_dynamodb');
                LastEvaluatedKey = (_a = event === null || event === void 0 ? void 0 : event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.LastEvaluatedKey;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                command = new lib_dynamodb_1.ScanCommand({
                    TableName: process.env.DYNAMO_TABLE_NAME,
                    Limit: Number((_b = event === null || event === void 0 ? void 0 : event.queryStringParameters) === null || _b === void 0 ? void 0 : _b.limit) + 1,
                    ExclusiveStartKey: LastEvaluatedKey
                });
                return [4 /*yield*/, docClient.send(command)];
            case 2:
                response = _c.sent();
                if (!(0, exports.isPostsFromDBValid)(response)) {
                    throw new Error('Getting posts from DB there is a undefined/null value');
                }
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify(response)
                    }];
            case 3:
                err_3 = _c.sent();
                console.error('Error:', err_3);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: 'There was an error getting posts from dynamodb' })
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.get_posts_from_dynamodb = get_posts_from_dynamodb;
var delete_post_from_dynamodb = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, params, command, response, err_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Starting delete post from dynamodb');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                postId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
                if (!postId) {
                    throw new Error('Id is missing from path');
                }
                params = {
                    TableName: process.env.DYNAMO_TABLE_NAME,
                    Key: { id: { S: postId } }
                };
                command = new client_dynamodb_1.DeleteItemCommand(params);
                return [4 /*yield*/, client.send(command)];
            case 2:
                response = _b.sent();
                if (response.$metadata.httpStatusCode !== 200) {
                    throw new Error("There was an issue deleting the post statusCode:".concat(response.$metadata.httpStatusCode));
                }
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify(response)
                    }];
            case 3:
                err_4 = _b.sent();
                console.error('Error:', err_4);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: 'There was an error deleting posts from dynamodb' })
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.delete_post_from_dynamodb = delete_post_from_dynamodb;
var update_post_in_dynamodb = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var data, params, command, response, err_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Starting update post in dynamodb');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                data = event.body && JSON.parse(event.body);
                if (!data.report || !data.buildSite || !((_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new Error("Value missing to update id: ".concat(data.id, " buildSite: ").concat(data.buildSite, " report: ").concat(data.report, " "));
                }
                params = {
                    TableName: process.env.DYNAMO_TABLE_NAME,
                    Key: { id: { S: event.pathParameters.id } },
                    UpdateExpression: 'SET report = :report, buildSite = :buildSite',
                    ExpressionAttributeValues: {
                        ':report': { S: data.report },
                        ':buildSite': { S: data.buildSite }
                    },
                    ReturnValues: 'ALL_NEW'
                };
                command = new client_dynamodb_1.UpdateItemCommand(params);
                return [4 /*yield*/, client.send(command)];
            case 2:
                response = _b.sent();
                if (response.$metadata.httpStatusCode !== 200) {
                    throw new Error("There was an issue updating the post statusCode:".concat(response.$metadata.httpStatusCode));
                }
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify(response)
                    }];
            case 3:
                err_5 = _b.sent();
                console.error('Error:', err_5);
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: 'There was an error updating post in dynamodb' })
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.update_post_in_dynamodb = update_post_in_dynamodb;
