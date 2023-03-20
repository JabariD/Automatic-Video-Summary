"use strict";
exports.__esModule = true;
exports.SourceValidator = void 0;
// SourceValidator class is used to validate the source of the video.
var SourceValidator = /** @class */ (function () {
    function SourceValidator() {
    }
    // A function called is_valid that passes the url to validateUrl and returns the result
    SourceValidator.prototype.isValid = function (url) {
        return this.validateUrl(url);
    };
    // A function that validates if the url is a valid youtube url or not
    // Note: Only accepts youtube urls
    SourceValidator.prototype.validateUrl = function (url) {
        var regex = /^(https?\:\/\/)?(www\.youtube\.com\/watch\?v=)[a-zA-Z0-9_-]{11}$/;
        return regex.test(url);
    };
    return SourceValidator;
}());
exports.SourceValidator = SourceValidator;
