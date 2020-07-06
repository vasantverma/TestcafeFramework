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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CucumberJsonReport = void 0;
var command_line_args_1 = require("./command-line-args");
var cucumber_json_interfaces_1 = require("./cucumber-json-interfaces");
var fs_1 = require("./fs");
var tags_parser_1 = require("./tags-parser");
var user_agent_parser_1 = require("./user-agent-parser");
var CucumberJsonReport = (function () {
    function CucumberJsonReport() {
        var _this = this;
        this._startTime = new Date();
        this._endTime = new Date();
        this._userAgents = [];
        this._testCount = 0;
        this._features = [];
        this._currentDevice = 'unknown';
        this._storageFolder = command_line_args_1.cliArgs.reportFolder || 'cucumber-json-reports';
        this.initializeWith = function (startTime, userAgents, testCount) {
            _this._startTime = startTime;
            _this._userAgents = userAgents;
            _this._testCount = testCount;
            _this._features = [];
            _this._currentFeature = undefined;
            _this._currentScenario = undefined;
            _this._currentStep = undefined;
            _this._currentPlatform = user_agent_parser_1.getPlatformFrom(userAgents[0]);
            _this._currentDevice = user_agent_parser_1.getDeviceFrom(userAgents[0]);
            _this._currentBrowser = user_agent_parser_1.getBrowserFrom(userAgents[0]);
            _this._currentApp = {
                name: command_line_args_1.cliArgs.appName,
                version: command_line_args_1.cliArgs.appVersion,
            };
            return _this;
        };
        this.finalizeWith = function (endTime, passed, warnings) {
            _this._endTime = endTime;
            _this._passed = passed;
            _this._warnings = warnings;
            if (_this.currentFeature) {
                _this.currentFeature.runInfo = {
                    endTime: _this._endTime,
                    passed: _this._passed,
                    startTime: _this._startTime,
                    testCount: _this._testCount,
                    userAgents: _this._userAgents,
                    warnings: _this._warnings,
                };
            }
            return _this;
        };
        this.toJson = function () {
            try {
                var json = JSON.stringify(_this._features, null, 2);
                return json;
            }
            catch (error) {
                return JSON.stringify(error, null, 2);
            }
        };
        this.writeFile = function () {
            _this._userAgents.map(function (userAgent) {
                _this._features.forEach(function (feature) {
                    var metadata = feature.metadata;
                    metadata.browser = user_agent_parser_1.getBrowserFrom(userAgent);
                    metadata.device = user_agent_parser_1.getDeviceFrom(userAgent);
                    metadata.platform = user_agent_parser_1.getPlatformFrom(userAgent);
                });
                var browser = fs_1.userAgentToFilename(userAgent);
                var time = fs_1.dateToFilename(_this._endTime);
                var fileName = [browser, '-', time, '.json'].join('');
                fs_1.writeReportSync(_this.toJson(), _this._storageFolder, fileName);
            });
        };
        this.toInfo = function () {
            var result = "\n            StartTime : " + _this._startTime + "\n            EndTime   : " + _this._endTime + "\n            UserAgents: " + _this._userAgents + "\n            TestCount : " + _this._testCount + "\n            Passed    : " + _this._passed + "\n            Warnings  : " + _this._warnings + "\n        ";
            return result;
        };
        this.createFeature = function (name, path) {
            var index = 0;
            var featureReport = {
                description: name || '',
                elements: [],
                id: _this.getFeatureIdFrom(name),
                keyword: 'Feature',
                line: 0,
                metadata: {
                    app: _this._currentApp,
                    browser: _this._currentBrowser,
                    device: _this._currentDevice,
                    platform: _this._currentPlatform,
                    date: new Date(),
                },
                name: name
                    ? name.replace('Feature:', '').replace('Feature :', '').trim()
                    : 'undefined',
                runInfo: undefined,
                skipped: false,
                tags: tags_parser_1.tagsFromDescription(name),
                uri: path + ":" + (index + 1),
            };
            _this.currentFeature = featureReport;
            return _this;
        };
        this.createScenario = function (name, testRunInfo) {
            var scenarioId = _this.getScenarioIdFrom(name);
            var scenario = {
                id: "Scenario" + scenarioId,
                keyword: 'Scenario',
                line: 0,
                name: name
                    ? name.replace('Scenario:', '').replace('Scenario :', '').trim()
                    : 'undefined',
                skipped: testRunInfo.skipped,
                sourceLine: 'undefined',
                status: 'passed',
                steps: [],
                tags: [],
                type: 'scenario',
                uri: '',
            };
            _this.currentScenario = scenario;
            _this.currentStep = _this.createDefaultStep(name, testRunInfo);
            _this.currentScenario.status = _this.currentStep.result.status;
            _this.addTagsToCurrentFeature(tags_parser_1.tagsFromDescription(name));
            return _this;
        };
        this.withError = function (error) {
            if (_this.currentStep && error) {
                _this.currentStep.result.error_message = error;
            }
            return _this;
        };
        this.withScreenshots = function (paths) {
            if (Array.isArray(paths) && paths.length > 0 && _this.currentStep) {
                _this.currentStep.image = paths.map(fs_1.toBase64DataImageUrl);
            }
            return _this;
        };
        this.createDefaultStep = function (name, testRunInfo) {
            var stepStatus = testRunInfo.skipped ? 'skipped' : 'passed';
            if (testRunInfo.errs && testRunInfo.errs.length > 0) {
                stepStatus = 'failed';
            }
            var sourceLine = name;
            var sourceLineIndex = 0;
            var step = __assign(__assign({}, cucumber_json_interfaces_1.testcafeDefaultStep), { name: sourceLine || 'undefined', result: {
                    duration: testRunInfo.durationMs,
                    error_message: undefined,
                    status: stepStatus,
                }, text: ["<a href=\"#\">" + (sourceLine || '') + "</a>"] });
            if (_this.currentFeature) {
                step.match = {
                    location: _this.currentFeature.uri + ":" + (sourceLineIndex || 0),
                };
            }
            return step;
        };
        this.getScenarioIdFrom = function (scenarioName) {
            var result = _this.currentFeature && _this.currentFeature.name
                ? _this.currentFeature.name + ";" + scenarioName
                : scenarioName;
            return result;
        };
        this.getFeatureIdFrom = function (featureName) {
            var result = featureName ? featureName : "Feature" + (_this._features.length + 1);
            return result;
        };
        this.addTagsToCurrentFeature = function (tags) {
            if (_this.currentFeature === undefined) {
                return;
            }
            var currentFeatureTagNames = _this.currentFeature.tags.map(function (tag) { return tag.name; });
            var toBeAddedTagNames = tags.map(function (tag) { return tag.name; });
            var aggregatedTagNames = tags_parser_1.distinct(__spreadArrays(currentFeatureTagNames, toBeAddedTagNames));
            _this.currentFeature.tags = aggregatedTagNames.map(function (tagName) { return ({
                line: 0,
                name: tagName,
            }); });
        };
    }
    Object.defineProperty(CucumberJsonReport.prototype, "currentFeature", {
        get: function () {
            return this._currentFeature;
        },
        set: function (v) {
            if (v === undefined) {
                return;
            }
            this._currentFeature = v;
            this._features.push(v);
            this._currentScenario = undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CucumberJsonReport.prototype, "currentScenario", {
        get: function () {
            return this._currentScenario;
        },
        set: function (v) {
            if (v === undefined) {
                return;
            }
            this._currentScenario = v;
            if (this._currentFeature && this._currentFeature.elements) {
                this._currentFeature.elements.push(v);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CucumberJsonReport.prototype, "currentStep", {
        get: function () {
            return this._currentStep;
        },
        set: function (v) {
            if (v === undefined) {
                return;
            }
            this._currentStep = v;
            if (this.currentScenario && this.currentScenario.steps) {
                this.currentScenario.steps.push(v);
            }
            if (v.result && v.result.status === 'failed' && this.currentScenario) {
                this.currentScenario.status = 'failed';
            }
        },
        enumerable: false,
        configurable: true
    });
    return CucumberJsonReport;
}());
exports.CucumberJsonReport = CucumberJsonReport;
//# sourceMappingURL=cucumber-json.js.map