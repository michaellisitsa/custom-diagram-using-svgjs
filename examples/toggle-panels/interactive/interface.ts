export async function initialize(getStoredParams, setStoredParams) {
    // Attach event handler to root element that contains all panels
    document.getElementById("group")?.addEventListener("click", (event) => {
        // Call getStoredParams() inside of event listener callback rather than at top level
        // to avoid stale closures
        const { removedPanels } = getStoredParams();
        const elements = document.getElementsByClassName("panel");
        if (Array.from(elements).includes(event.target as Element)) {
            const idx = (event.target as Element).id;
            // params are not available in initialize function,
            // We can derive length of panels from number of rendered DOM elements.
            // Alternatively we could save panels in a variable in module scope.
            let newPanels: number[] = Array.from(elements).map((el) => 0);
            if (removedPanels) {
                if (removedPanels.length > newPanels.length) {
                    // The number of panels has decreased than were present
                    // when the user last interacted with the diagram
                    // We need to remove the extra elements from the stored array
                    newPanels = removedPanels.slice(0, newPanels.length);
                } else {
                    // The number of panels has increased than were present
                    // when the user last interacted with the diagram
                    // or has stayed the same.
                    newPanels.splice(0, removedPanels.length, ...removedPanels);
                }
            }
            // Toggle the currently selected removed panel
            newPanels[idx] = newPanels[idx] === 1 ? 0 : 1;
            setStoredParams({
                removedPanels: newPanels,
            });
        }
    });
}

export async function render(params, getStoredParams) {
    // Adjust the viewbox to fit the height of the panels
    document
        .getElementById("svg")
        ?.setAttribute("viewBox", `0 0 500 ${50 + 25 * params.panels.length}`);
    const storedParams = getStoredParams();
    if (!!params.panels) {
        const el = document.getElementById("toggle");
        const group = document.getElementById("group");
        // Replace all children of the group with new panels
        // rather than bothering with diffing panels.
        group?.replaceChildren(
            ...params.panels.map((panel, idx) => {
                // Use a def to define the panel once and reuse it
                const thisPanel = el?.cloneNode(true) as SVGElement;
                thisPanel?.setAttribute("id", `${idx}`);
                // Set up a common selector that can be used to identify all panels
                // within the event listener callback
                thisPanel?.setAttribute("class", `panel`);
                thisPanel?.setAttribute("y", (idx * 25).toString());
                if (storedParams.removedPanels?.[idx] === 1) {
                    thisPanel?.setAttribute("fill", "red");
                } else {
                    thisPanel?.setAttribute("fill", "green");
                }
                return thisPanel;
            }),
        );
    }
}

export async function params() {
    return [{ key: "panels", type: "Array<number>" }];
}

export async function storedParams() {
    return [{ key: "removedPanels", type: "Array<number>" }];
}
