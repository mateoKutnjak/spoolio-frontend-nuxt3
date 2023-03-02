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

export function reformatDateTime(rawDate: string | undefined): string {
    if (!rawDate) return "NULL ERROR"

    const [datePart, timePart] = rawDate.replaceAll('Z', '').split('T');
    const [year, month, day] = datePart.split('-')
    const [hour, minute, secondDecimal] = timePart.split(':')
    const [second, _] = secondDecimal.split('.')

    return `${day}/${month}/${year} at ${hour}:${minute}:${second}`
}

export function reformatSeconds(seconds: number): string {
    if (seconds < 60) {
        const result = Math.floor(seconds);
        const suffix = result % 10 == 1 ? 'second' : 'seconds';
        return `${result.toFixed(0)} ${suffix}`;
    }

    if (seconds < 60 * 60) {
        const result = Math.floor(seconds / 60);
        const suffix = result % 10 == 1 ? 'min' : 'mins';
        return `${result.toFixed(0)} ${suffix}`;
    }

    if (seconds < 60 * 60 * 24) {
        const result = Math.floor(seconds / 60 / 60);
        const suffix = result % 10 == 1 ? 'hour' : 'hours';
        return `${result.toFixed(0)} ${suffix}`;
    }

    const result = Math.floor(seconds / 60 / 60 / 24);
    const suffix = result % 10 == 1 ? 'day' : 'days';
    return `${result.toFixed(0)} ${suffix}`;
}