"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cucumber_json_1 = require("./cucumber-json");
var reporter_1 = require("./reporter");
exports['default'] = function () {
    var report = new cucumber_json_1.CucumberJsonReport();
    return {
        reportFixtureStart: function (name, path) {
            reporter_1.extendedReporterPlugin.reportFixtureStart.call(this, name, path, report);
        },
        reportTaskDone: function (endTime, passed, warnings) {
            reporter_1.extendedReporterPlugin.reportTaskDone.call(this, endTime, passed, warnings, report);
        },
        reportTaskStart: function (startTime, userAgents, testCount) {
            reporter_1.extendedReporterPlugin.reportTaskStart.call(this, startTime, userAgents, testCount, report);
        },
        reportTestDone: function (name, testRunInfo) {
            reporter_1.extendedReporterPlugin.reportTestDone.call(this, name, testRunInfo, report);
        },
        renderErrors: function (errs) {
            return reporter_1.extendedReporterPlugin.renderErrors.call(this, errs);
        },
        createErrorDecorator: function () {
            return reporter_1.extendedReporterPlugin.createErrorDecorator.call(this);
        },
    };
};
module.exports = exports['default'];
//# sourceMappingURL=index.js.map