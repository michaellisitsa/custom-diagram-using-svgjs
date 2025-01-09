# Static Diagram Core

## Server

The static diagram code (Client section below) that is compiled by the user runs inside an AWS lambda container running Node v18. The isolate is torn down between every call of render or params.

The code compiled by the user of this repository runs inside a [V8 isolate](https://v8docs.nodesource.com/node-0.8/d5/dda/classv8_1_1_isolate.html) powered by [isolated-vm](https://github.com/laverdet/isolated-vm) library, which is chosen for its security benefits running untrusted code in a server environment. For a more detailed view of the isolated-vm settings, see the static diagram test runner.

[isolated-vm](https://github.com/laverdet/isolated-vm) has some significant limitations particularly around supporting nodejs standard library and nodes global object

### Supported Features

-   Node version = v18.9.0. ECMA-262 (EC-2023). see [https://node.green/](https://node.green/)

-   Memory Limit = 128 MB _[link](https://github.com/laverdet/isolated-vm/blob/main/README.md#new-ivmisolateoptions)_

-   Execution Timeout = 500ms _[link](https://github.com/laverdet/isolated-vm/blob/main/README.md#contextevalsynccode-options)_

-   Javascript Standard built-in objects _[link](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)_

### Unsupported Features

-   No Network Access: e.g. `net`, `dns`, `socket`, `http`, `fetch`

-   No File System access. e.g. `fs`, `fs/promises`

-   Minimal nodejs standard library - e.g. `util.TextDecoder` etc.

-   No Process or OS Module: e.g. `process`, `os`

-   No access to global object: tbc.

### Execution Lifecycle

The lambda expects a javascript file that contains at minimum a `params()` and a `render()` in [src/static/interface.ts](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/static/interface.ts) executed every time user changes params from sheet. The simplest possible render() is a valid SVG string, like below although this doesn't benefit from the boilerplate that provides packaging and a browser-like DOM API.

```javascript
function render(params, storedParams) {
    return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="green" strokeWidth="4" fill="yellow" />
        </svg>`;
}

function params() {
    return [
        { key: "param_1", type: "string" },
        { key: "param_2", type: "string" },
    ];
}
```

## Bundling

The static diagram code is the compiled javascript file generated from the static diagram repository by ES Build.

The compiled file is compatible with the server limitations above excluding, although see unsupported features when developing your diagram.

### Included Packages

-   SVGDOM - _[link](https://github.com/svgdotjs/svgdom)_ Render SVG DOM via
-   Buffer _[link](https://github.com/feross/buffer)_ browser build of NodeJS Buffer API
-   Typescript

### SVG DOM Specific Restrictions

SVGDOM and SVGDotJS functionality is generally supported. The following ClearCalcs specific limitations have been imposed:

-   Raster images cannot determine their natural size, see _[link](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalHeight)_.
-   `getBBox` will provide bounding box dimensions assuming Google Open Sans Regular font _[link](https://fonts.google.com/specimen/Open+Sans)_.

#### Add custom fonts (Experimental)

Future compatibility is not guaranteed. It is recommended to contact ClearCalcs if intending to put this into production.

1. Add ttf file to [svgdomPatches/scripts/fonts](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/svgdomPatches/scripts/fonts)
2. Update [svgdomPatches/scripts/compileFont.js](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/svgdomPatches/scripts/compileFont.js) with new font name.
3. Compile font into static asset

```javascript
npm run compile-static-fonts
```

3. Update [static-build.js](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/static-build.js) pointing to new font name.
4. Update [svgdomPatches/scripts/textUtils.js](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/svgdomPatches/textUtils.js) pointing to new font name.

### Add your own packages

Dependencies may be bundled by adding them to the [package.json](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/package.json) file and running `npm run compile-static`.

The server limitations on nodejs built-in modules, file system & network apply not just to your code, but any packages that are bundled in via ES Build.

When choosing a package, a version targeted for browsers may be available and more likely to work as the Isolate restrictions are similar to the browser restrictions.

Test that the compiled file can be used to render an SVG by using the test runner, which works on the same server code, although your computer's local nodejs version may be different.

### Custom Loaders

The following assets can be imported into any file as [ESBuild text type](https://esbuild.github.io/content-types/#text)

-   SVG
-   HTML

Other image or data formats may be possible by adding ES Build custom loaders. Consult ClearCalcs if custom loaders are required.

A simple example of loading an external SVG.

```javascript
import logo_svg from "./assets/logo.svg";
...
// Encode SVG as SVGDOM object
const logo_node = SVG();
logo_node.svg(logo_svg);

export default function update(params, storedParams) {
    // DOM element should be available before this is called.
    SVG_ROOT!.querySelector("#logo-container")?.appendChild(logo_node.node);
}
```

## Usage

Unlike the simplified server render function, SVGDOM is bundled to allow DOM manipulation mirroring the DOM API found in the browser.

We add some boilerplate at top of [src/static/render.ts](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/static/render.ts) called by the `render()`. The author should use the SVGDOM primitives for `document` and `window` in place of the browser equivalents and generate an SVG string from the result of those object's manipulation.

The `storedParams` parameter will be provided as an object to the static diagram if user interaction has been added (see [Adding User Interaction](/quick-start-guide?id=adding-user-interaction)).

-   [src/static/interface.ts](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/static/interface.ts)

```javascript
// storedParams is optional unless combining with interactive diagram with user interaction
function render(params, storedParams) {
    return update(params, storedParams);
}
```

-   [src/static/render.ts](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/static/render.ts)

```javascript
import { createSVGWindow } from "svgdom";
import { SVG, registerWindow } from "@svgdotjs/svg.js";
import main_html from "./main.html"; // your html file

const windowObj = createSVGWindow();
const documentObj = windowObj.document;

registerWindow(windowObj, documentObj);
const CANVAS = SVG(documentObj.documentElement);
CANVAS.viewbox("0 0 500 300");

CANVAS.svg(main_html);

export default function update(params, storedParams) {
    // DOM manipulation methods go here
    // e.g.
    SVG_ROOT.querySelector("#circle")?.setAttribute("fill", params.circleFill);

    // Render from user interaction
    if (!!storedParams?.circleBorder) {
        SVG_ROOT!.querySelector("#circle")?.setAttribute("stroke", storedParams.circleBorder);
    }
    // Always return the generated SVG string at the end of the update function.
    return CANVAS.svg();
}
```

will return:

```html
<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:svgjs="http://svgjs.dev/svgjs"
    version="1.1"
    viewBox="0 0 500 100"
>
    <!-- Contents of main.html -->
</svg>
```

Note the `CANVAS` is a root SVG element generated by SVGDOM that will wrap your [src/static/main.html](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/static/main.html) file and provide all correct namespace properties. Any svg elements in `main.html` are nested inside it. See [Rendering](/static-diagram-rendering.md) for details.
