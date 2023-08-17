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
exports.lambdaHandler = void 0;
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
var lambdaHandler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var environmentalVariables, hello;
    return __generator(this, function (_a) {
        try {
            environmentalVariables = {
                handler: process.env._HANDLER,
                aws_region: process.env.AWS_REGION,
                aws_execution_env: process.env.AWS_EXECUTION_ENV,
                aws_lambda_function_name: process.env.AWS_LAMBDA_FUNCTION_NAME,
                aws_lambda_memory_size: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
                aws_lambda_function_version: process.env.AWS_LAMBDA_FUNCTION_VERSION,
                aws_lambda_log_group_name: process.env.AWS_LAMBDA_LOG_GROUP_NAME,
                aws_lambda_log_stream_name: process.env.AWS_LAMBDA_LOG_STREAM_NAME,
                aws_lambda_runtime_api: process.env.AWS_LAMBDA_RUNTIME_API,
                lang: process.env.LANG,
                tz: process.env.TZ,
                lambda_task_root: process.env.LAMBDA_TASK_ROOT,
                lambda_runtime_dir: process.env.LAMBDA_RUNTIME_DIR,
                path: process.env.PATH,
                ld_library_path: process.env.LD_LIBRARY_PATH
            };
            hello = {
                hello: 'hello'
            };
            return [2 /*return*/, {
                    statusCode: 200,
                    body: JSON.stringify(hello)
                }];
        }
        catch (err) {
            console.log(err);
            return [2 /*return*/, {
                    statusCode: 500,
                    body: JSON.stringify({
                        message: 'some error happened'
                    })
                }];
        }
        return [2 /*return*/];
    });
}); };
exports.lambdaHandler = lambdaHandler;
