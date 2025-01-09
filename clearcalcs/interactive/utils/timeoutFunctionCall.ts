// If the function passed in is bound using `.bind()`, the
// function name comes back as `bound name` which isn't
// helpful to the user, so let's tidy it up so the error
// message makes more sense.
function friendlyFnName(functionName: string) {
    if (functionName.startsWith("bound")) {
        return functionName.slice(6);
    } else {
        return functionName;
    }
}

export default async function timeoutFunctionCall(
    fn: Function,
    delay: number = 5000,
) {
    const promise = new Promise(async function (resolve, reject) {
        // Setup a timeout timer, that will reject the promise if it
        // runs.
        const timeout = setTimeout(function () {
            reject(
                new ReferenceError(
                    `${friendlyFnName(
                        fn.name,
                    )} timed out after ${delay}ms. Please check your method and try again.`,
                ),
            );
        }, delay);

        try {
            const response = await fn();
            resolve(response);
        } catch (error) {
            reject(error);
        } finally {
            // By the properties of async functions, this won't run until
            // after above. But the timeout will fire in the event loop if
            // reaches the delay, so we need to clear it here, so that we
            // can resolve the response.
            clearTimeout(timeout);
        }
    });

    return promise;
}
