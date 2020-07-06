"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStackTraceHeaderFrom = void 0;
exports.getStackTraceHeaderFrom = function (stackTrace) {
    var stackTracelines = stackTrace.split('\n');
    if (stackTracelines.length <= 5) {
        return stackTracelines[0];
    }
    var lastIndex = 0;
    var result = [];
    for (var index = 0; index < 5; index++) {
        var line = stackTracelines[index];
        if (line && line.includes('Browser: ')) {
            lastIndex = index;
            continue;
        }
        if (line && line.includes('Screenshot: ')) {
            lastIndex = index;
            continue;
        }
    }
    for (var index = 0; index <= lastIndex; index++) {
        result.push(stackTracelines[index]);
    }
    return result.join('\n');
};
//# sourceMappingURL=stack-trace-parser.js.map