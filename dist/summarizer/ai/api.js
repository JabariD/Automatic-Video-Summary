"use strict";
/*
This uses https://www.npmjs.com/package/chatgpt-official api.

Feel free to install or uninstall.


*/
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
exports.__esModule = true;
require("dotenv").config();
var openai_1 = require("openai");
var tiktoken_1 = require("@dqbd/tiktoken");
var textchunk = require('textchunk');
var API = /** @class */ (function () {
    // Constructor for API class that initializes OpenAI client.
    function API() {
        this.kModel_ = "gpt-3.5-turbo";
        this.kTokensCutOff_ = 3400; // Note: Matches with max_tokens in SendRequestToAPI(). For ref: https://platform.openai.com/docs/models/gpt-3-5
        // Attempt to get API key from environment variables
        var api_key_or_error = this.getApiKey();
        if (api_key_or_error instanceof Error) {
            throw api_key_or_error;
        }
        var configuration = new openai_1.Configuration({
            apiKey: api_key_or_error.toString()
        });
        this.encClient_ = (0, tiktoken_1.encoding_for_model)("gpt-3.5-turbo");
        this.OpenAiClient_ = new openai_1.OpenAIApi(configuration);
    }
    // Main entry point of API. Returns a summary of the video. Returns an error if there is an error.
    API.prototype.summarizeVideo = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var combinedSummarizedText, error_1, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.recursivelySummarize(text)];
                    case 1:
                        combinedSummarizedText = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, error_1];
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.sendRequestToAPI(combinedSummarizedText)];
                    case 4:
                        response = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        return [2 /*return*/, error_2];
                    case 6: return [2 /*return*/, response];
                }
            });
        });
    };
    // If text is > kTokensCutOff_, then split text into chunks of 3500 words and summarize each chunk, then combine all summaries into one summary.
    // If the combined summary is more than ktokenscutoff do the same thing until the summary is less than kTokensCutOff_. Then send to API and return response.
    API.prototype.recursivelySummarize = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var chunks, summaries, _i, chunks_1, chunk, summary, error_3, combinedSummaries, _a, summaries_1, summary;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("Entering Chunking Layer");
                        console.log("tokens in text: ", this.countNumTokens(text));
                        if (this.countNumTokens(text) <= this.kTokensCutOff_) {
                            return [2 /*return*/, text];
                        }
                        chunks = textchunk.chunk(text, 12000);
                        if (!chunks) {
                            throw new Error("Critical error occurred. Unable to split text into chunks to be sent to API.");
                        }
                        summaries = [];
                        console.log("num of chunks: ", chunks.length);
                        _i = 0, chunks_1 = chunks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < chunks_1.length)) return [3 /*break*/, 7];
                        chunk = chunks_1[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        console.log("num of tokens in chunk: " + this.countNumTokens(chunk));
                        return [4 /*yield*/, this.sendRequestToAPI(chunk)];
                    case 3:
                        summary = _b.sent();
                        // sleep for 2 seconds to avoid rate limit
                        return [4 /*yield*/, this.sleep(/*sec=*/ 1)];
                    case 4:
                        // sleep for 2 seconds to avoid rate limit
                        _b.sent();
                        summaries.push(summary);
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _b.sent();
                        console.log(error_3.message);
                        // TODO(payton): Figure out how to handle errors if one chunk fails.
                        throw error_3;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7:
                        combinedSummaries = "";
                        for (_a = 0, summaries_1 = summaries; _a < summaries_1.length; _a++) {
                            summary = summaries_1[_a];
                            combinedSummaries += summary;
                        }
                        return [2 /*return*/, this.recursivelySummarize(combinedSummaries)];
                }
            });
        });
    };
    // Returns API key from environment variables or error if not found.
    API.prototype.getApiKey = function () {
        return process.env.API_KEY
            ? process.env.API_KEY
            : new Error("API_KEY not found in environment variables. Please set API_KEY in .env file.");
    };
    // Sends request to API and returns response or error.
    // Docs: https://platform.openai.com/docs/guides/chat/introduction
    // TODO(payton): Change signature to sendRequestToAPI(createChatCompletionRequest(systemMessage, message), modelOptions);
    // TODO(payton): Modify signature to return interface response.
    API.prototype.sendRequestToAPI = function (text) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var starterInstructionsAndPrompt, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Confirm meets API limit requirements. It's good to put this logic here an API call must MEET these guidelines. If it doesn't we get error.
                        if (text.length == 0) {
                            throw new Error("Critical error. Text is empty.");
                        }
                        if (this.countNumTokens(text) > this.kTokensCutOff_) {
                            throw new Error("Critical error. Text length exceeds API limit. Please split text into chunks of 3500 words or less.");
                        }
                        starterInstructionsAndPrompt = [
                            {
                                role: "system",
                                content: "You are SummarizerGPT. You are summarizing one YouTube video. You are very intelligent and create very unique summaries. Feel free to pick an interesting thing said and expand upon it a bit. Try to be as helpful as possible."
                            },
                            {
                                role: "user",
                                content: "Summarize the following video. Be detailed and extract the key point of what was made (not just the topic). Be smart and add your own knowledge, but relevant. Here's the video transcription: " +
                                    text
                            },
                        ];
                        return [4 /*yield*/, this.OpenAiClient_.createChatCompletion({
                                messages: starterInstructionsAndPrompt,
                                max_tokens: 650,
                                model: this.kModel_,
                                temperature: 0.9,
                                frequency_penalty: 1.2
                            })];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, (_a = response.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content];
                }
            });
        });
    };
    // Returns number of words in text.
    // Deprecated: Use countNumTokens() instead.
    API.prototype.countWords = function (text) {
        return text.split(" ").length;
    };
    API.prototype.sleep = function (sec) {
        return new Promise(function (resolve) { return setTimeout(resolve, sec * 1000); });
    };
    // Counts the number of tokens in text.
    // Note: Encoding must match the model used in the actual API.
    API.prototype.countNumTokens = function (text) {
        // See https://github.com/dqbd/tiktoken#readme and https://github.com/openai/openai-python/blob/main/chatml.md for more info.
        return this.encClient_.encode(text).length;
    };
    return API;
}());
exports["default"] = API;
/*
Open questions:
1. The exact prompt to use for the API?
2. The exact settings to use for the API.
3. Handling videos that transcripts are longer than token limit: https://blog.devgenius.io/how-to-get-around-openai-gpt-3-token-limits-b11583691b32 and https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them

For reference:
console.log(response.data.choices);
console.log(response.data.choices[0].message);
console.log(typeof response.data.choices[0].message);
console.log(typeof response.data.choices[0].message?.content);

const options = {
  temperature: 0.7, // OpenAI parameter
  max_tokens: 4096, // OpenAI parameter [Max response size by tokens]
  top_p: 0.9, // OpenAI parameter
  frequency_penalty: 0, // OpenAI parameter
  presence_penalty: 0, // OpenAI parameter
  instructions: `You are ChatGPT, a large language model trained by OpenAI.`, // initial instructions for the bot
  model: "gpt-3.5-turbo", // OpenAI parameter  `gpt-3.5-turbo` is PAID
};

*/
