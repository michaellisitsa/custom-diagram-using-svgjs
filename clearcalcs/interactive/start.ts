import generateErrorResponse from "./utils/generateErrorResponse";
import timeoutFunctionCall from "./utils/timeoutFunctionCall";
import debounce from "./utils/debounce";

import * as clearcalcsInterface from "./interface";
import * as diagramInterface from "../../src/interactive/interface";

const IFRAME_INTERFACE = { ...diagramInterface, ...clearcalcsInterface };
const SOURCE_ORIGIN =
    window.parent === window
        ? window.origin
        : new URL(document.referrer).origin;

let storedParams = {};
const storedParamsInterface = {
    getStoredParams() {
        return storedParams;
    },
    setStoredParams(newStoredParams) {
        window.parent.postMessage(
            {
                callId: "data",
                response: {
                    value: newStoredParams,
                },
            },
            SOURCE_ORIGIN,
        );
    },
    // private
    _internalSetStoredParams(newStoredParams) {
        storedParams = newStoredParams;
    },
};
export default async function start() {
    window.addEventListener(
        "message",
        async function (event) {
            // Ignore any messages that aren't from the initial source that loaded
            // the iframe.
            if (event.origin !== SOURCE_ORIGIN) return;

            // When the diagram is the top level element e.g not in an iframe,
            // avoid acting on certain events to prevent recursive loop
            // due to listening and posting within the same window
            if (window.parent === window && !event.data.data) return;

            try {
                const { method, data, callId } = event.data;
                if (typeof IFRAME_INTERFACE[method] !== "function") {
                    throw new ReferenceError(
                        `${method} has not been implemented. Please check method name and try again.`,
                    );
                }

                if (!callId) {
                    throw new TypeError(
                        "callId cannot be undefined. Please add callId and try again.",
                    );
                }

                let storedParams, params;

                if (data) {
                    ({ storedParams, ...params } = data);
                    // Has never been set before or invalid data
                    if (typeof storedParams !== "object") {
                        storedParams = {};
                    }

                    storedParamsInterface._internalSetStoredParams(
                        storedParams,
                    );
                }

                try {
                    // Bind the data the method function, so we can pass into
                    // timeoutFunctionCall agnostically, without it needing to
                    // know about the function parameters.
                    const response = await timeoutFunctionCall(
                        IFRAME_INTERFACE[method].bind(
                            null,
                            params,
                            storedParamsInterface.getStoredParams,
                        ),
                    );
                    window.parent.postMessage(
                        { callId, response },
                        SOURCE_ORIGIN,
                    );
                } catch (callError) {
                    window.parent.postMessage(
                        {
                            ...generateErrorResponse(callError),
                            callId,
                        },
                        SOURCE_ORIGIN,
                    );
                }
            } catch (globalError) {
                // These are errors that were picked up in the setting up of the
                // request, (ie. event.data wasn't an object, or callId doesn't
                // exist)
                //
                // These errors don't have a callId at this point, so we need to
                // handle them differently.
                window.parent.postMessage(
                    generateErrorResponse(globalError),
                    SOURCE_ORIGIN,
                );
            }
        },
        false,
    );

    const resizeObserver = new ResizeObserver(
        debounce(function ([entry]) {
            const { width, height } = document.body.getBoundingClientRect();
            window.parent.postMessage(
                {
                    response: { width, height },
                    callId: "resize",
                },
                SOURCE_ORIGIN,
            );
        }, 100),
    );
    resizeObserver.observe(document.body, { box: "border-box" });

    if (typeof IFRAME_INTERFACE["initialize"] === "function") {
        try {
            await timeoutFunctionCall(
                IFRAME_INTERFACE.initialize.bind(
                    null,
                    storedParamsInterface.getStoredParams,
                    storedParamsInterface.setStoredParams,
                ),
            );
            window.parent.postMessage({ callId: "initialized" }, SOURCE_ORIGIN);
        } catch (callError) {
            window.parent.postMessage(
                {
                    ...generateErrorResponse(callError),
                    callId: "initialized",
                },
                SOURCE_ORIGIN,
            );
        }
    }
}
