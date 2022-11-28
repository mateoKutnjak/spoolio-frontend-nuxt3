const re = /(?:\.([^.]+))?$/;

export function filenameExtension(filename: string) {
    return re.exec(filename)![1]
}