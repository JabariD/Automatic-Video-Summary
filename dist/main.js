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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSummarizer = void 0;
var summarizer_1 = require("./summarizer/summarizer");
var transcript_1 = require("./transcript/transcript");
var source_validator_1 = require("./valid_source/source_validator");
// The main entry point for the system. This class is responsible for handling all the series of functions.
var EntryPoint = /** @class */ (function () {
    function EntryPoint() {
        // Initialize the clients
        this.sourceValidatorClient_ = new source_validator_1.SourceValidator();
        this.transcriptClient_ = new transcript_1.Transcript();
        this.summarizerClient_ = new summarizer_1.Summarizer();
    }
    EntryPoint.prototype.summarizeWebVideo = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var transcript, error_1, summary, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.sourceValidatorClient_.isValid(url)) {
                            throw new Error("Invalid URL. The URL must be a YouTube URL with an ID.");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.transcriptClient_.getTranscript(url)];
                    case 2:
                        transcript = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error("Error in getting transcript: " + error_1.message);
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.summarizerClient_.getSummary(transcript)];
                    case 5:
                        summary = _a.sent();
                        return [2 /*return*/, summary];
                    case 6:
                        error_2 = _a.sent();
                        console.log(error_2);
                        throw new Error("Error in getting summary: " + error_2.message);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return EntryPoint;
}());
exports.VideoSummarizer = EntryPoint;
/*
Observations:
- Note: Make sure to change the URL in code.
- run the test by doing npx jest -t Main

- Note: Not an exact science. These also depend on how much the user is speaking. If the user is speaking a lot, then the summary will be longer.


- Manual testing...
- Pay wall guard against API calls
- We absolutely need to chunk the video into smaller chunks.
- Use title as way to understand the context.
- Video must have captions
- Have 3 levels of summarization: short, medium, long. This will instruct the API how long,detailed the summary should be.

*/
/*
Open Questions:
1. Where would it be deployed?
- (AWS, GCP, Azure, Heroku, etc.)
- As a cloud function?

2: Possibly migrate test to start mocking the API calls.

// Fill in README. of this information.
Files to include in zip file to AWS Elastic Beanstalk:
- dist
- gitignore
- package.json
- package-lock.json
- tsconfig.json


*/ 
