"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendedReporterPlugin = void 0;
var reporter_helpers_1 = require("./reporter-helpers");
var stack_frames_parser_1 = require("./stack-frames-parser");
var stack_trace_parser_1 = require("./stack-trace-parser");
var chalk = __importStar(require("chalk"));
exports.extendedReporterPlugin = {
    reportTaskStart: function (startTime, userAgents, testCount, report) {
        if (report) {
            report.initializeWith(startTime, userAgents, testCount);
        }
    },
    reportFixtureStart: function (name, path, report) {
        report.createFeature(name, path);
    },
    reportTestDone: function (name, testRunInfo, report) {
        var formattedErrorMessage;
        if (Array.isArray(testRunInfo.errs) && testRunInfo.errs.length > 0) {
            formattedErrorMessage = this.renderErrors(testRunInfo.errs);
        }
        var screenshots = [];
        if (Array.isArray(testRunInfo.screenshots) && testRunInfo.screenshots.length > 0) {
            testRunInfo.screenshots.forEach(function (img) { return screenshots.push(img.screenshotPath); });
        }
        report
            .createScenario(name, testRunInfo)
            .withError(formattedErrorMessage)
            .withScreenshots(screenshots);
    },
    reportTaskDone: function (endTime, passed, warnings, report) {
        if (report) {
            report.finalizeWith(endTime, passed, warnings);
            report.writeFile();
            return;
        }
    },
    chalk: chalk.default,
    formatError: function (err, prefix) {
        return reporter_helpers_1.nativeFormatError(err, prefix);
    },
    newline: function () {
        return reporter_helpers_1.nativeNewLine();
    },
    setIndent: function (val) {
        return reporter_helpers_1.nativeSetIndent(val);
    },
    write: function (text) {
        return reporter_helpers_1.nativeWrite(text);
    },
    renderErrors: function (errs) {
        var _this = this;
        if (!Array.isArray(errs)) {
            reportUnexpectedErrObject(errs);
            return 'Error: reporter cucumber-json has detected an unexpected error object. Please see details in the console logs';
        }
        var originalStackTraceLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = 100;
        var lines = [];
        errs.map(function (err, idx) {
            var prefix = _this.chalk.red(idx + 1 + ") ");
            if (err && typeof err.callsite === 'string') {
                reportUnexpectedErrObject(err);
                lines.push(renderNativeError(function () { return _this.formatError(err, prefix); }));
                return;
            }
            if (!err.callsite) {
                reportUnexpectedErrObject(err);
                lines.push(renderNativeError(function () { return _this.formatError(err, prefix); }));
                return;
            }
            stack_frames_parser_1.filterStackFramesIn(err.callsite);
            var originalStackFrames = __spreadArrays(err.callsite.stackFrames);
            var files = stack_frames_parser_1.getAllFilesIn(err.callsite);
            var stackTraceHeader;
            files.map(function (filename, index) {
                err.callsite.stackFrames = stack_frames_parser_1.stackFramesOf(filename).in(originalStackFrames);
                err.callsite.filename = filename;
                err.callsite.lineNum = err.callsite.stackFrames[0].getLineNumber() - 1;
                var stackTrace = _this.formatError(err, prefix);
                if (index === 0) {
                    lines.push(stackTrace);
                    stackTraceHeader = stack_trace_parser_1.getStackTraceHeaderFrom(stackTrace);
                    return;
                }
                if (stackTraceHeader) {
                    var truncatedStackTrace = stackTrace.replace(stackTraceHeader, '');
                    lines.push(truncatedStackTrace);
                    return;
                }
                lines.push(stackTrace);
            });
        });
        Error.stackTraceLimit = originalStackTraceLimit;
        return lines.join('\n');
    },
    createErrorDecorator: function () {
        var _this = this;
        var hasShownError = false;
        var lineSeparator = '--------------------------------------------\n';
        return {
            a: function (str) { return "\"" + _this.chalk.underline(str) + "\""; },
            'a screenshot-path': function (str) { return _this.chalk.grey.underline(str); },
            code: function (str) { return str; },
            'div code-frame': function (str) { return str; },
            'div code-line': function (str) {
                if (hasShownError) {
                    hasShownError = false;
                    return str + "\n" + lineSeparator;
                }
                return str + "\n";
            },
            'div code-line-last': function (str) { return str; },
            'div code-line-num': function (str) { return "   " + str + " |"; },
            'div code-line-num-base': function (str) {
                hasShownError = true;
                return lineSeparator + _this.chalk.bgRed(" &rarr; " + str + " ") + '|';
            },
            'div code-line-src': function (str) { return str; },
            'div message': function (str) { return _this.chalk.bold.red(str); },
            'div screenshot-info': function (str) { return str; },
            'div stack': function (str) { return '\n\n' + str; },
            'div stack-line': function (str) { return str + '\n'; },
            'div stack-line-last': function (str) { return str; },
            'div stack-line-location': function (str) { return " (" + _this.chalk.grey.underline(str) + ")"; },
            'div stack-line-name': function (str) { return "   at " + _this.chalk.bold(str); },
            'span subtitle': function (str) { return "- " + _this.chalk.bold.red(str) + " -"; },
            'span syntax-comment': function (str) { return _this.chalk.grey.bold(str); },
            'span syntax-invalid': function (str) { return _this.chalk.inverse(str); },
            'span syntax-keyword': function (str) { return _this.chalk.cyan(str); },
            'span syntax-number': function (str) { return _this.chalk.magenta(str); },
            'span syntax-punctuator': function (str) { return _this.chalk.grey(str); },
            'span syntax-regex': function (str) { return _this.chalk.magenta(str); },
            'span syntax-string': function (str) { return _this.chalk.green(str); },
            'span user-agent': function (str) { return _this.chalk.grey(str); },
            strong: function (str) { return _this.chalk.bold(str); },
        };
    },
};
function reportUnexpectedErrObject(err) {
    if (err && err.isTestCafeError) {
        return;
    }
    console.warn("testcafe-reporter-cucumber-json: cannot render errors because the error object has an unexpected content");
    console.warn("testcafe-reporter-cucumber-json: please provide the following log to github.com/hdorgeval/testcafe-reporter-cucumber-json :");
    console.warn("testcafe-reporter-cucumber-json :", { err: err });
}
function renderNativeError(formatter) {
    var nativeMessage;
    try {
        nativeMessage = formatter();
    }
    catch (error) {
        nativeMessage = error.message || "" + error;
    }
    var formattedErrorMessage = nativeMessage.replace(/>/gi, '&rarr;');
    return formattedErrorMessage;
}
//# sourceMappingURL=reporter.js.map