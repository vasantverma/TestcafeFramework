"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateToFilename = exports.userAgentToFilename = exports.toBase64DataImageUrl = exports.fileExtension = exports.fileExists = exports.jsonFrom = exports.getFilename = exports.getParentDirs = exports.readAllLines = exports.writeReportSync = exports.writeJsonFileSync = exports.getFilesRecursivelyIn = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var isDirectory = function (path) { return fs_1.statSync(path).isDirectory(); };
var ignoreNodeModule = function (path) { return path.indexOf('node_modules') < 0; };
var ignoreDotDir = function (path) { return path.startsWith('.') === false; };
var ignoreBuildDir = function (path) { return path.startsWith('build') === false; };
var getDirectoriesIn = function (path) {
    return fs_1.readdirSync(path)
        .map(function (name) { return path_1.join(path.toString(), name); })
        .filter(isDirectory)
        .filter(ignoreNodeModule)
        .filter(ignoreDotDir)
        .filter(ignoreBuildDir);
};
var isFile = function (path) { return fs_1.statSync(path).isFile(); };
var defaultFileFilter = function () { return true; };
var getFilesInDirectory = function (path, fileFilter) {
    return fs_1.readdirSync(path)
        .map(function (name) { return path_1.join(path.toString(), name); })
        .filter(isFile)
        .filter(fileFilter || defaultFileFilter);
};
var getDirectoriesRecursivelyIn = function (path) {
    var subDirs = getDirectoriesIn(path);
    var result = __spreadArrays(subDirs);
    subDirs.map(function (dir) {
        result.push.apply(result, getDirectoriesRecursivelyIn(dir));
    });
    return result;
};
exports.getFilesRecursivelyIn = function (directoryPath, fileFilter) {
    var dirs = [directoryPath];
    getDirectoriesRecursivelyIn(directoryPath).map(function (dir) { return dirs.push(dir); });
    var files = dirs
        .map(function (dir) { return getFilesInDirectory(dir, fileFilter); })
        .reduce(function (a, b) { return a.concat(b); }, []);
    return files;
};
exports.writeJsonFileSync = function (data) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    var json = JSON.stringify(data, null, 2);
    var filePath = path_1.join.apply(void 0, paths);
    ensureDirectoryStructureExists(filePath);
    fs_1.writeFileSync(filePath, json);
};
exports.writeReportSync = function (data) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    var filePath = path_1.join.apply(void 0, paths);
    ensureDirectoryStructureExists(filePath);
    fs_1.writeFileSync(filePath, data);
};
exports.readAllLines = function (filePath) {
    var lines = fs_1.readFileSync(filePath, 'utf8').split('\n');
    return lines;
};
exports.getParentDirs = function (filePath) {
    var paths = filePath.split(path_1.sep).filter(function (dir) { return dir !== '.'; });
    var dirs = paths.splice(0, paths.length - 1);
    return dirs;
};
exports.getFilename = function (filePath) {
    var filename = filePath.split(path_1.sep).pop();
    return filename;
};
var ensureDirectoryStructureExists = function (filePath) {
    var dirs = exports.getParentDirs(filePath);
    var partialPath = '.';
    dirs.map(function (dir) {
        partialPath = [partialPath, dir].join(path_1.sep);
        ensureDirectoryExists(partialPath);
    });
};
var ensureDirectoryExists = function (directoryPath) {
    if (fs_1.existsSync(directoryPath)) {
        return;
    }
    fs_1.mkdirSync(directoryPath);
};
exports.jsonFrom = function (filePath) {
    if (!isFile(filePath)) {
        return {};
    }
    return JSON.parse(fs_1.readFileSync(filePath, 'utf8'));
};
exports.fileExists = function (filePath) {
    if (fs_1.existsSync(filePath) && isFile(filePath)) {
        return true;
    }
    if (fs_1.existsSync(filePath) && isDirectory(filePath)) {
        throw new Error("File '" + filePath + "' is a directory but should be a file.");
    }
    return false;
};
exports.fileExtension = function (filePath) {
    var extension = path_1.extname(filePath);
    return extension.startsWith('.') ? extension.replace('.', '') : extension;
};
exports.toBase64DataImageUrl = function (path) {
    var imageType = exports.fileExtension(path);
    var base64Data = fs_1.readFileSync(path).toString('base64');
    var dataUrl = "data:image/" + imageType + ";base64," + base64Data;
    return dataUrl;
};
exports.userAgentToFilename = function (userAgent) {
    var filename = userAgent
        .replace(/[\s./:\\]/g, '_')
        .replace(/___/g, '_')
        .replace(/__/g, '_')
        .trim();
    return filename;
};
exports.dateToFilename = function (date) {
    var filename = date.toISOString().replace(/\./g, '-').replace(/:/g, '-').trim();
    return filename;
};
//# sourceMappingURL=fs.js.map