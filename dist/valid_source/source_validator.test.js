"use strict";
exports.__esModule = true;
var source_validator_1 = require("./source_validator");
describe("SourceValidator", function () {
    it("should return true for valid youtube url", function () {
        var sourceValidator = new source_validator_1.SourceValidator();
        expect(sourceValidator.isValid("https://www.youtube.com/watch?v=9bZkp7q19f0")).toBe(true);
    });
    it("should return false if website is not youtube", function () {
        var sourceValidator = new source_validator_1.SourceValidator();
        expect(sourceValidator.isValid("https://www.google.com")).toBe(false);
    });
    it("should return false for youtube channel url", function () {
        var sourceValidator = new source_validator_1.SourceValidator();
        expect(sourceValidator.isValid("https://www.youtube.com/channel/UCt8qXopnhaFQKACpesQ0NWA")).toBe(false);
    });
    it("should return false for youtube playlist url", function () {
        var sourceValidator = new source_validator_1.SourceValidator();
        expect(sourceValidator.isValid("https://www.youtube.com/playlist?list=PLH0Szn1yYNed-qNJ-Isr2XdPCj29ZPJnS")).toBe(false);
    });
});
