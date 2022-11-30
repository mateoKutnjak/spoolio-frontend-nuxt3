export function parseDate(rawDate: string): Date {
    return new Date(rawDate)
}

export function formatDate(date: Date): string {
    var dateNow = new Date();
    var rawFormatted = date.toDateString().split(' ');

    if (dateNow.getFullYear() === date.getFullYear()) {
        if (dateNow.getDay() === date.getDay()) {
            return "Today"
        }
        return rawFormatted[1] + " " + rawFormatted[2]
    }
    return rawFormatted[1] + " " + rawFormatted[2] + ", " + rawFormatted[3]
}