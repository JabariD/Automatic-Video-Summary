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
exports.__esModule = true;
var api_1 = __importDefault(require("./api"));
// TODO(payton): Fix flaky test because API returns different results each time.
describe("API", function () {
    it("should return a summary of simple text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, summary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    api = new api_1["default"]();
                    return [4 /*yield*/, api.summarizeVideo("All right, so here we are in front of the, uh, elephants, and the cool thing about these guys is that, is that they have really, really, really long, um, trunks, and that's, that's cool, and that's pretty much all there is to say.")];
                case 1:
                    summary = _a.sent();
                    console.log(summary);
                    // Honestly if the summary does not have the word "elephants" or "trunks" in it, it is probably not a good summary. Therefore we should be able to check for those words and it's likely to not make the case flaky.
                    expect(summary).toContain("elephants");
                    expect(summary).toContain("trunks");
                    return [2 /*return*/];
            }
        });
    }); }, 30000); // set timeout to be 30 seconds (note this uses an API and make time to generate)
    it("should return a summary of more complex text", function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, text, summary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    api = new api_1["default"]();
                    text = "When the day of Pentecost came, they were all together in one place. Suddenly a sound like the blowing of a violent wind came from heaven and filled the whole house where they were sitting. They saw what seemed to be tongues of fire that separated and came to rest on each of them. All of them were filled with the Holy Spirit and began to speak in other tongues as the Spirit enabled them. Now there were staying in Jerusalem God-fearing Jews from every nation under heaven. When they heard this sound, a crowd came together in bewilderment, because each one heard their own language being spoken. Utterly amazed, they asked: “Aren’t all these who are speaking Galileans? Then how is it that each of us hears them in our native language? Parthians, Medes and Elamites; residents of Mesopotamia, Judea and Cappadocia, Pontus and Asia, Phrygia and Pamphylia, Egypt and the parts of Libya near Cyrene; visitors from Rome (both Jews and converts to Judaism); Cretans and Arabs—we hear them declaring the wonders of God in our own tongues!” Amazed and perplexed, they asked one another, “What does this mean?”";
                    return [4 /*yield*/, api.summarizeVideo(text)];
                case 1:
                    summary = _a.sent();
                    console.log(summary);
                    // Expect words that more than likely is in the summary
                    expect(summary).toContain("Pentecost");
                    return [2 /*return*/];
            }
        });
    }); }, 30000); // set timeout to be 30 seconds (note this uses an API and make time to generate)
    // Note: This test should be last because it resets the API key.
    it("should return error for invalid API key", function () { return __awaiter(void 0, void 0, void 0, function () {
        var api;
        return __generator(this, function (_a) {
            try {
                process.env.API_KEY = "";
                api = new api_1["default"]();
                // This should throw an error because the API key is invalid.
                throw new Error("The test did not throw an error.");
            }
            catch (e) {
                expect(e.message).toContain("API_KEY not found");
            }
            return [2 /*return*/];
        });
    }); });
});
