"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeFormatError = exports.nativeNewLine = exports.nativeSetIndent = exports.nativeWrite = void 0;
var ReporterPluginHost = require('testcafe/lib/reporter/plugin-host');
var outStream = '';
var plugin = new ReporterPluginHost({}, outStream);
exports.nativeWrite = plugin.write;
exports.nativeSetIndent = plugin.setIndent;
exports.nativeNewLine = plugin.newline;
exports.nativeFormatError = plugin.formatError;
//# sourceMappingURL=reporter-helpers.js.map