function parseDate(rawDate: string): Date {
    return new Date(rawDate)
}

function formatDate(date: Date): string {
    var dateNow = new Date();
    var rawFormatted = date.toDateString().split(' ');

    if (isSameDay(dateNow, date)) {
        return "Today"
    }

    if (isSameYear(dateNow, date)) {
        return rawFormatted[1] + " " + rawFormatted[2]
    }

    return rawFormatted[1] + " " + rawFormatted[2] + ", " + rawFormatted[3]
}

function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
}

function isSameYear(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear();
}

export function reformatDate(rawDate: string | undefined): string {
    if (!rawDate) return "NULL ERROR"
    return formatDate(parseDate(rawDate));
}