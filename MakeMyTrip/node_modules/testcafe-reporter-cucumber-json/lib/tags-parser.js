"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinct = exports.isNoisyTag = exports.tagsFromDescription = void 0;
var options_1 = require("./options");
exports.tagsFromDescription = function (description) {
    if (description === undefined) {
        return [];
    }
    var words = description
        .split(/\s|\n|\r|\.|:|!|,|;/)
        .map(function (w) { return w.trim(); })
        .filter(function (w) { return w.length > 2; })
        .map(function (w) { return w.toLocaleLowerCase(); })
        .filter(function (w) { return !exports.isNoisyTag(w, options_1.options.noisyTags); });
    return exports.distinct(words).map(function (word) { return ({ name: "@" + word, line: 0 }); });
};
exports.isNoisyTag = function (tag, unwantedTags) {
    if (unwantedTags && unwantedTags.length === 0) {
        return false;
    }
    var isNoisy = unwantedTags.filter(function (noisyTag) { return noisyTag.toLocaleLowerCase() === tag.toLocaleLowerCase(); }).length > 0;
    return isNoisy;
};
exports.distinct = function (items) {
    var hashset = new Set(__spreadArrays(items));
    return Array.from(hashset.values());
};
//# sourceMappingURL=tags-parser.js.map