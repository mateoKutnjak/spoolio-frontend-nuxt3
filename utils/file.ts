const filenameExtensionRegex = /(?:\.([^.]+))?$/;


export function toIconName(file: File): string {
    switch (file.type) {
        case "application/pdf":
            return "mdi:file-pdf-outline"
        case "text/plain":
            return "mdi:file-document-outline";
        case "image/jpeg":
        case "image/jpg":
        case "image/png":
            return "mdi:file-image-outline";
        default:
            return "mdi:file-question-outline";
    }
}

export function toIconNameByExtension(fileExtension: string): string {
    switch (fileExtension) {
        case "pdf":
            return "mdi:file-pdf-outline"
        case "txt":
            return "mdi:file-document-outline";
        case "jpeg":
        case "jpg":
        case "png":
            return "mdi:file-image-outline";
        default:
            return "mdi:file-question-outline";
    }
}

export function toIconNameSafe(file: File | string | undefined): string {
    if (!file) {
        return "material-symbols:error-circle-rounded-outline";
    }
    if (typeof file === "string") {
        return toIconNameByExtension(urlExtractFileSuffix(file));
    }
    return toIconName(file);
}

export function filenameExtension(filename: string) {
    return filenameExtensionRegex.exec(filename)![1]
}

export function fileSizeFormatted(file: File): string {
    const baseLog = Math.log(file.size) / Math.log(1024);
    const extensions = ["B", "kB", "MB", "GB", "TB"]

    return (file.size / (1024 ** Math.floor(baseLog))).toFixed(1) + " " + extensions[Math.floor(baseLog)]
}

export function urlExtractFilename(url: string): string {
    const splitted = url.split('/');
    const last = splitted[splitted.length - 1]
    const last2 = last.split('?')
    return last2[0]
}

export function urlExtractFileSuffix(url: string): string {
    const splitted = url.split('.');
    return splitted[splitted.length - 1]
}

export function extractUrlFileStringUnion(obj: File | string) {
    if (typeof obj === 'string') {
        return obj;
    } else if (obj instanceof File) {
        return obj.name;
    }

    throw createError(`Object ${obj} is neither File nor string`)
}