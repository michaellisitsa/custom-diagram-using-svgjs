const iframeEl = document.getElementById("iframe") as HTMLIFrameElement;
const formEl = document.getElementById("postDataForm") as HTMLFormElement;
const outputEl = document.getElementById("output") as HTMLDivElement;
const buttonEl = document.getElementById("clear") as HTMLButtonElement;

const pendingCalls = new Map();

window.addEventListener(
    "message",
    function (event) {
        const { error, errorType, errorMessage, response, callId } = event.data;
        if (!callId) {
            if (error) {
                printOutputMessage("Errored (internal), with:-", "red");
                printOutputMessage(`${errorType}: ${errorMessage}`);
                printOutputMessage("");
            }
        } else if (callId === "resize" || callId === "initialize") {
            printOutputMessage(
                `Received  \`${callId}\` call (internal), with:-`,
                "green",
            );
            prettyPrintObject(response);
            printOutputMessage("");
            if (callId === "resize") {
                iframeEl.style.height = response.height + "px";
            }
        } else {
            const { resolve, reject } = pendingCalls.get(callId);
            if (error) {
                reject(new Error(`${errorType}: ${errorMessage}`));
            } else {
                resolve(response);
            }
        }
    },
    false,
);

formEl.addEventListener("submit", async function (event) {
    event.preventDefault();
    let formData = new FormData(formEl);
    const method = formData.get("method");
    const callId = Date.now();

    let data;
    try {
        eval(`var evalData = ${formData.get("data")?.toString() || undefined}`);
        // @ts-ignore - LOOK A DINGO! Yes this is bad!
        data = evalData;
    } catch (e) {
        const error = e as Error;
        printOutputMessage(`Data is invalid: ${error.message}`);
        return;
    }

    try {
        printOutputMessage(
            `Making \`${method}\` call (${callId}), with:-`,
            "teal",
        );
        prettyPrintObject(data);
        printOutputMessage("");

        let postRequest = {
            method,
            callId,
            data,
        };
        const response = await postMessage(postRequest);
        printOutputMessage(
            `Received \`${method}\` call (${callId}), with:-`,
            "green",
        );
        prettyPrintObject(response);
        printOutputMessage("");
    } catch (e) {
        const error = e as Error;
        printOutputMessage(
            `Errored \`${method}\` call (${callId}), with:-`,
            "red",
        );
        printOutputMessage(`"${error.message}"`);
        printOutputMessage("");
    }
});

buttonEl.addEventListener("click", function () {
    outputEl.innerText = "";
});

async function postMessage(messageData) {
    const promise = new Promise((resolve, reject) => {
        pendingCalls.set(messageData.callId, { resolve, reject });
        iframeEl.contentWindow!.postMessage(messageData, iframeEl.src);
    });
    return promise;
}

function printOutputMessage(message, color = "white") {
    outputEl.innerHTML += `<span style="color:${color}">${message}\n</span>`;
}
function prettyPrintObject(object, color = "white") {
    outputEl.innerHTML += `<span style="color:${color}">${JSON.stringify(
        object,
        undefined,
        4,
    )}\n</span>`;
}
