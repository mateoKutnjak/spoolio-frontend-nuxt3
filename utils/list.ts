export function listContains<T>(list: T[], item: T): boolean {
    return list.indexOf(item) > -1;
}