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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Summarizer = void 0;
var api_1 = __importDefault(require("./ai/api"));
// Summarizer 
var Summarizer = /** @class */ (function () {
    function Summarizer() {
        // Summarizer must have valid API instance to work.
        this.API_ = new api_1.default();
    }
    // Public function to summarize the video segments. Returns Error if there is an error in the summarization process.
    Summarizer.prototype.getSummary = function (videoSegments) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.summarize(videoSegments)];
                }
                catch (error) {
                    return [2 /*return*/, error];
                }
                return [2 /*return*/];
            });
        });
    };
    // Process to summarize a video.
    Summarizer.prototype.summarize = function (videoSegments) {
        return __awaiter(this, void 0, void 0, function () {
            var sanitizedText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sanitizedText = this.normalizeText(videoSegments);
                        return [4 /*yield*/, this.API_.summarizeVideo(sanitizedText)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Returns a normalized (i.e. no special characters, no extra spaces) string of the text in the video segments.
    Summarizer.prototype.normalizeText = function (videoSegments) {
        // Concatenate all the `text` fields of the `textSegments` array into a single string
        var text = videoSegments.map(function (segment) { return segment.text; }).join(' ');
        // Remove all non-alphanumeric characters and replacing them with spaces, but include commas and dashes.
        var normalizedText = text.replace(/[^a-zA-Z0-9',-]/g, ' ');
        // Remove all extra spaces
        var finalText = normalizedText.trim().replace(/\s+/g, ' ');
        return finalText;
    };
    return Summarizer;
}());
exports.Summarizer = Summarizer;
;
/*
Open questions:
1) How do we handle the case where the video is too long (defined as bigger than API allows) to summarize?
- We can either return an error
- Return a summary of the first X minutes of the video.
- Split the video into chunks and summarize each chunk, then combine the summaries. (preferred)

2) How do we handle timestamps if we are summarizing the video?
- Not handle them.



*/ 
