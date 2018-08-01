export interface FileResult {
    name: string,
    type: string,
    binaryType: BinaryType,
    isAllowed: boolean,
    hex: string
}

export enum BinaryType {
    PNG = "image/png",
    JPEG = "image/jpeg",
    GIF = "image/gif",
    PDF = "application/pdf",
    ZIP = "application/zip",
    OTHER = "unknown"
}

export function getBinaryType(signature: string): BinaryType {
    switch (signature) {
        case '89504E47':
            return BinaryType.PNG
        case '47494638':
            return BinaryType.GIF
        case '25504446':
            return BinaryType.PDF
        case 'FFD8FFDB':
        case 'FFD8FFE0':
        case 'FFD8FFE1':
            return BinaryType.JPEG
        case '504B0304':
            return BinaryType.ZIP
        default:
            return BinaryType.OTHER
    }
}

function isFileResult(arg: BinaryType | FileResult): arg is FileResult {
    return (<FileResult>arg).binaryType !== undefined;
}

export function isAllowedType(arg: BinaryType | FileResult) {
    const type = isFileResult(arg) ? arg.binaryType : <BinaryType>arg;
    return type == BinaryType.JPEG || type == BinaryType.PNG || type == BinaryType.GIF;
}

export function getFileType(file: File, callback: (file: FileResult) => void) {
    const fileReader = new FileReader();

    fileReader.onloadend = evt => {
        if (evt.target.readyState === FileReader.DONE) {
            const uint = new Uint8Array(evt.target.result);
            let bytes = [];
            uint.forEach(byte => {
                bytes.push(byte.toString(16));
            })
            const hex = bytes.join('').toUpperCase();

            const binaryType = getBinaryType(hex);
            callback({
                name: file.name,
                type: file.type,
                binaryType: binaryType,
                isAllowed: isAllowedType(binaryType),
                hex: hex
            })
        }
    }

    const blob = file.slice(0, 4);
    fileReader.readAsArrayBuffer(blob);
}

export function getFileTypes(
    files: File[], 
    next?: (file: FileResult) => void, 
    success?: (file: FileResult[]) => void
) {
    const results = []
    for (let file of files) {
        getFileType(file, result => {
            if (next) next(result)
            results.push(result);
            if (success && results.length == files.length) {
                success(results);
            }
        })
    }
}

export default {
    BinaryType,
    getFileType,
    getFileTypes,
    getBinaryType,
    isAllowedType
}