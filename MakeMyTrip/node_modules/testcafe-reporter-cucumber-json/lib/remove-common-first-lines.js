"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCommonFirstLines = void 0;
function removeCommonFirstLines(reference, content) {
    var linesInContent = content.split('\n');
    var commonFirstLines = '';
    for (var index = 0; index < linesInContent.length; index++) {
        var nextCommonPart = index === 0
            ? "" + commonFirstLines + linesInContent[index]
            : commonFirstLines + "\n" + linesInContent[index];
        if (reference.includes(nextCommonPart)) {
            commonFirstLines = nextCommonPart;
            continue;
        }
        if (index > 2) {
            return content.replace(commonFirstLines, '');
        }
        return content;
    }
    return content.replace(commonFirstLines, '');
}
exports.removeCommonFirstLines = removeCommonFirstLines;
//# sourceMappingURL=remove-common-first-lines.js.map