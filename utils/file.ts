const filenameExtensionRegex = /(?:\.([^.]+))?$/;


export function toIconName(file: File): string {
    switch (file.type) {
        case "application/pdf":
            return "mdi:file-pdf-outline"
        case "text/plain":
            return "mdi:file-document-outline";
        default:
            return "mdi:file-question-outline";
    }
}

export function toIconNameSafe(file: File | undefined): string {
    if (!file) {
        return "material-symbols:error-circle-rounded-outline";
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