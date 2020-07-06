"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cliArgs = void 0;
var minimist_1 = __importDefault(require("minimist"));
var args = minimist_1.default(process.argv.slice(2));
exports.cliArgs = __assign(__assign({}, args), { appName: args['reporter-app-name'], appVersion: args['reporter-app-version'], reportFolder: args['reporter-json-folder'], rawCommandLine: process.argv.join(' ') });
if (exports.cliArgs.appName === undefined) {
    console.warn("testcafe-reporter-cucumber-json: cannot get the App name from the command-line");
    console.warn("testcafe-reporter-cucumber-json: add the option --reporter-app-name='My App'");
}
if (exports.cliArgs.appVersion === undefined) {
    console.warn("testcafe-reporter-cucumber-json: cannot get the App version from the command-line");
    console.warn("testcafe-reporter-cucumber-json: add the option --reporter-app-version='x.y.z'");
}
//# sourceMappingURL=command-line-args.js.map