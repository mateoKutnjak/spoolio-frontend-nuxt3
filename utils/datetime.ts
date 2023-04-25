function parseDate(rawDate: string): Date {
    return new Date(rawDate)
}

function prettyFormatDate(date: Date): string {
    var dateNow = new Date();
    var rawFormatted = date.toDateString().split(' ');

    if (isSameDay(dateNow, date)) {
        return "Today"
    }

    if (isSameYear(dateNow, date)) {
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })}`
    }

    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`
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
    return prettyFormatDate(parseDate(rawDate));
}

export function reformatDateTime(rawDate: string | undefined): string {
    if (!rawDate) return "NULL ERROR"
    const date = parseDate(rawDate);
    return `${date.getDate().toString().padStart(2, '0')}/${date.getMonth().toString().padStart(2, '0')}/${date.getFullYear()} at ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export function reformatTime(rawDate: string | undefined): string {
    if (!rawDate) return "NULL ERROR"
    const date = parseDate(rawDate);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export function reformatSeconds(seconds: number): string {

    // * Add one day to every duration as buffer
    seconds += 24 * 60 * 60;

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