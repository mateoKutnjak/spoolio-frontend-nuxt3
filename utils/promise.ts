export function promiseWithTimeout<T>(
    promise: Promise<T>,
    ms: number,
    timeoutError = { data: 'Timeout error', statusMessage: 'Timeout error', statusCode: 99 }
): Promise<T> {
    // create a promise that rejects in milliseconds
    const timeout = new Promise<T>((_, reject) => {
        setTimeout(() => {
            reject(timeoutError);
        }, ms);
    });

    // returns a race between timeout and the passed promise
    return Promise.race([promise, timeout]);
}