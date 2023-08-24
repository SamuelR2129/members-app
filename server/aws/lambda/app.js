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
exports.get_s3_image = exports.s3_image_uploader = void 0;
var client_s3_1 = require("@aws-sdk/client-s3");
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
var s3 = new client_s3_1.S3Client({ region: process.env.REGION_NAME });
var s3_image_uploader = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var bucketName, uploadParams, command, uploadFileResult, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!event.file || !event.randomImageName) {
                    throw new Error('Parametres for uploading to s3 are undefined');
                }
                bucketName = event.Records[0].s3.bucket.name;
                uploadParams = {
                    Bucket: bucketName,
                    Body: event.file.buffer,
                    Key: event.randomImageName,
                    ContentType: event.file.mimetype
                };
                command = new client_s3_1.PutObjectCommand(uploadParams);
                return [4 /*yield*/, s3.send(command)];
            case 1:
                uploadFileResult = _a.sent();
                if (!uploadFileResult || uploadFileResult.$metadata.httpStatusCode != 200) {
                    throw new Error("There was an issue uploading image to s3 - code: ".concat(uploadFileResult === null || uploadFileResult === void 0 ? void 0 : uploadFileResult.$metadata.httpStatusCode, ", result:").concat(uploadFileResult, " "));
                }
                //const url = `${s3.config.endpoint}/${bucketName}/${event.randomImageName}`;
                //s3_save_image_url_to_dynamo(url);
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify(event.randomImageName)
                    }];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({
                            message: "An error happened in the s3_image_uploader - ".concat(err_1)
                        })
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.s3_image_uploader = s3_image_uploader;
var get_s3_image = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var bucketName, command, imageUrl, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!event.imageKey) {
                    throw new Error('bucketName or imageKey for downloading from s3 is undefined');
                }
                bucketName = event.Records[0].s3.bucket.name;
                command = new client_s3_1.GetObjectCommand({
                    Key: event.imageKey,
                    Bucket: bucketName
                });
                return [4 /*yield*/, (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 })];
            case 1:
                imageUrl = _a.sent();
                if (!imageUrl) {
                    throw new Error('Image url path from s3 returned null/undefined');
                }
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify(imageUrl)
                    }];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({
                            message: "An error happened in the get_s3_image - ".concat(err_2)
                        })
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.get_s3_image = get_s3_image;
