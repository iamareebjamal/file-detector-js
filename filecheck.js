var BinaryType = {
    PNG: "image/png",
    JPEG: "image/jpeg",
    GIF: "image/gif",
    PDF: "application/pdf",
    ZIP: "application/zip",
    OTHER: "unknown"
};

var FileCheck = (function() {

    var allowedTypes = [BinaryType.GIF, BinaryType.PNG, BinaryType.JPEG];

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

    function isAllowedType(type, types) {
        if (!types) {
            types = allowedTypes;
        }

        var allowed = false;
        for (var i = 0; i < types.length; i++) {
            var fileType = types[i];
            allowed = allowed || type == fileType;
        }
        return allowed;
    }

    function checkFileType(file, callback, /* optional */ types) {
        var fileReader = new FileReader();
        fileReader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
                var uint = new Uint8Array(evt.target.result);
                var bytes = [];
                uint.forEach(function (byte) {
                    bytes.push(byte.toString(16));
                });
                var hex = bytes.join('').toUpperCase();
                var binaryType = getBinaryType(hex);
                callback({
                    name: file.name,
                    type: file.type,
                    binaryType: binaryType,
                    isAllowed: isAllowedType(binaryType, types),
                    hex: hex
                });
            }
        };
        fileReader.readAsArrayBuffer(file.slice(0, 4));
    }

    function checkFileTypes(files, next, success, /* optional */ types) {
        var results = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            getFileType(file, function (result) {
                if (next)
                    next(result);
                results.push(result);
                if (success && results.length == files.length) {
                    success(results);
                }
            }, types);
        }
    }

    return {
        checkFileType: checkFileType,
        checkFileTypes: checkFileTypes,
        getBinaryType: getBinaryType,
        isAllowedType: isAllowedType,
        allowedTypes: allowedTypes
    }
}());