export function toIconName(file: File): string {
    switch (file.type)
    {
        case "application/pdf":
            return "mdi:file-pdf-outline"
        case "text/plain":
            return "mdi:file-document-outline";
        default:
            return "mdi:file-question-outline";
    }
}

export function toIconNameSafe(file: File | undefined): string {
    if (!file)
    {
        return "material-symbols:error-circle-rounded-outline";
    }
    return toIconName(file);
}