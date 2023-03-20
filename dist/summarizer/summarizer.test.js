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
exports.__esModule = true;
var summarizer_1 = require("./summarizer");
describe("Summarizer", function () {
    it("should normalize text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var videoSegments, sanitizedText;
        return __generator(this, function (_a) {
            videoSegments = [
                {
                    text: "All right, so here we are in front of the elephants,\n    very cool",
                    duration: 3000,
                    offset: 0
                },
            ];
            sanitizedText = new summarizer_1.Summarizer()["normalizeText"](videoSegments);
            expect(sanitizedText).toBe("All right, so here we are in front of the elephants, very cool");
            return [2 /*return*/];
        });
    }); });
    it("should normalize multiple segments", function () { return __awaiter(void 0, void 0, void 0, function () {
        var videoSegments, sanitizedText;
        return __generator(this, function (_a) {
            videoSegments = [
                {
                    text: "access to it would have to be a really",
                    duration: 4320,
                    offset: 179400
                },
                {
                    text: "great video yeah yeah right individual",
                    duration: 4500,
                    offset: 181319
                },
                {
                    text: "video yeah I well that's why it's there",
                    duration: 3239,
                    offset: 183720
                },
            ];
            sanitizedText = new summarizer_1.Summarizer()["normalizeText"](videoSegments);
            expect(sanitizedText).toBe("access to it would have to be a really great video yeah yeah right individual video yeah I well that's why it's there");
            return [2 /*return*/];
        });
    }); });
    it("should normalize multiple segments with invalid characters", function () { return __awaiter(void 0, void 0, void 0, function () {
        var videoSegments, sanitizedText;
        return __generator(this, function (_a) {
            videoSegments = [
                { text: "foo-bar    \n @", duration: 3000, offset: 0 },
                { text: "normalized", duration: 3000, offset: 3000 },
                { text: "     checker,@  \n", duration: 3000, offset: 6000 },
            ];
            sanitizedText = new summarizer_1.Summarizer()["normalizeText"](videoSegments);
            expect(sanitizedText).toBe("foo-bar normalized checker,");
            return [2 /*return*/];
        });
    }); });
    it("should summarize video segments", function () { return __awaiter(void 0, void 0, void 0, function () {
        var videoSegments, summarizer, summary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videoSegments = [
                        {
                            text: "All right, so here we are in front of the, uh, elephants   \n",
                            duration: 3000,
                            offset: 0
                        },
                        {
                            text: ", and the cool thing about these guys is that, is that they have really, really",
                            duration: 6000,
                            offset: 3000
                        },
                        {
                            text: ", really long, um, trunks, and that's, that's cool, and that's pretty much all there is to say.",
                            duration: 9000,
                            offset: 6000
                        },
                    ];
                    summarizer = new summarizer_1.Summarizer();
                    return [4 /*yield*/, summarizer.getSummary(videoSegments)];
                case 1:
                    summary = _a.sent();
                    console.log(summary);
                    expect(summary).toContain("elephants");
                    return [2 /*return*/];
            }
        });
    }); });
});
