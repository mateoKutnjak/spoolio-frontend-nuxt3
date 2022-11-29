export function fileSizeFormatted(file: File): string {
    const baseLog = Math.log(file.size) / Math.log(1024);
    const extensions = ["B", "kB", "MB", "GB", "TB"]

    return (file.size / (1024 ** Math.floor(baseLog))).toFixed(1) + " " + extensions[Math.floor(baseLog)]
}