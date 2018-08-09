"use strict";
exports.__esModule = true;
var BinaryType;
(function (BinaryType) {
    BinaryType["PNG"] = "image/png";
    BinaryType["JPEG"] = "image/jpeg";
    BinaryType["GIF"] = "image/gif";
    BinaryType["PDF"] = "application/pdf";
    BinaryType["ZIP"] = "application/zip";
    BinaryType["OTHER"] = "unknown";
})(BinaryType = exports.BinaryType || (exports.BinaryType = {}));
function getBinaryType(signature) {
    switch (signature) {
        case '89504E47':
            return BinaryType.PNG;
        case '47494638':
            return BinaryType.GIF;
        case '25504446':
            return BinaryType.PDF;
        case 'FFD8FFDB':
        case 'FFD8FFE0':
        case 'FFD8FFE1':
            return BinaryType.JPEG;
        case '504B0304':
            return BinaryType.ZIP;
        default:
            return BinaryType.OTHER;
    }
}
exports.getBinaryType = getBinaryType;
function isFileResult(arg) {
    return arg.binaryType !== undefined;
}
exports.allowedTypes = [BinaryType.GIF, BinaryType.PNG, BinaryType.JPEG];
function isAllowedType(arg, types) {
    if (types === void 0) { types = exports.allowedTypes; }
    var type = isFileResult(arg) ? arg.binaryType : arg;
    var allowed = false;
    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
        var fileType = types_1[_i];
        allowed = allowed || type == fileType;
    }
    return allowed;
}
exports.isAllowedType = isAllowedType;
function getFileType(file, callback, fileTypes) {
    if (fileTypes === void 0) { fileTypes = exports.allowedTypes; }
    var fileReader = new FileReader();
    fileReader.onloadend = function (evt) {
        if (evt.target.readyState === FileReader.DONE) {
            var uint = new Uint8Array(evt.target.result);
            var bytes_1 = [];
            uint.forEach(function (byte) {
                bytes_1.push(byte.toString(16));
            });
            var hex = bytes_1.join('').toUpperCase();
            var binaryType = getBinaryType(hex);
            callback({
                name: file.name,
                type: file.type,
                binaryType: binaryType,
                isAllowed: isAllowedType(binaryType, fileTypes),
                hex: hex
            });
        }
    };
    var blob = file.slice(0, 4);
    fileReader.readAsArrayBuffer(blob);
}
exports.getFileType = getFileType;
function getFileTypes(files, next, success, fileTypes) {
    if (fileTypes === void 0) { fileTypes = exports.allowedTypes; }
    var results = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        getFileType(file, function (result) {
            if (next)
                next(result);
            results.push(result);
            if (success && results.length == files.length) {
                success(results);
            }
        }, fileTypes);
    }
}
exports.getFileTypes = getFileTypes;
exports["default"] = {
    BinaryType: BinaryType,
    getFileType: getFileType,
    getFileTypes: getFileTypes,
    getBinaryType: getBinaryType,
    isAllowedType: isAllowedType
};
