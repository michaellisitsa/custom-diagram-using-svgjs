# Interactive Diagram Rendering

## Iframe sandbox

Custom diagram should be restricted to use features available inside the `<iframe>` sandbox it is rendered in. The sandbox attribute has following allowances:

-   `allow-scripts` [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#allow-scripts) allows Javascript to be executed.
-   `allow-same-origin` allows ClearCalcs to communicate with the custom diagram via the [postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage). The iframe origin is different from ClearCalcs.com, and this setting does not change that.

For specific browser restrictions, see [Mozilla docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox), which include but are not limited to:

-   no downloads
-   no form submission
-   no modals e.g. `window.alert`
-   no popups e.g. `<a target="_blank">`. User should use middle-button to open link in new tab
-   no access to parent DOM

## Rendering based on Viewport Width

Diagrams may be rendered in column widths between 380 to 800 px, or in full screen covering the full viewport of the user.

Techniques for rendering size and position for larger viewport widths are provided in [Global Capabilities: Full Screen](/global-capabilities?id=full-screen).
