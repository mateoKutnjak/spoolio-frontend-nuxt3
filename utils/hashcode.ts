export function properiesBasedHashcode(obj: { [key: number]: any }) {
    const concatenation = Object.entries(obj)
        .reduce((acc, [key, value]) => acc + key + value.toString(), "")

    return concatenation;
}