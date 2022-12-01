export function promiseWithTimeout<T>(
    promise: Promise<T>,
    ms: number,
    timeoutError = new Error('Timeout error')
) {
    // create a promise that rejects in milliseconds
    const timeout = new Promise((_, reject) => {
        setTimeout(() => {
            reject(timeoutError);
        }, ms);
    });

    // returns a race between timeout and the passed promise
    return Promise.race([promise, timeout]);
}