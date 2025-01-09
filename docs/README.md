# Quick Start Guide

## Introduction

Documentation can be found at https://clearcalcs.github.io/custom-diagram-boilerplate/.

Custom Diagrams is a powerful method of plugging in rich visualisations into ClearCalcs calculators. They deliver a full-featured HTML, CSS and Javascript environment to develop engineering drawings, diagrams graphs, or even interactive experiences such as maps or CAD viewers. Custom diagrams fully take advantage of the tight integration with the live calculation engine of ClearCalcs.

Try out one of our diagrams inside a real-world calculator below. Change one of the "Bolt Pattern Coordinates" and watch the diagram update.

<div style="text-align: center;">

[Click to Go to Interactive Example](https://clearcalcs.com/embed/steelBoltAnalysisFree/8d313ffc-6145-42a0-a86d-dddac98aa136?suppressLogo=1 ":include :type=iframe width=450px height=500px")

</div>

## Choosing Diagram Type

Diagrams come in two different forms, interactive and static. Static are simpler SVGs that can be used for general diagrams where there is no need for user interactivity. Interactive diagrams are more advanced full HTML iframes that can also send values back out into the calculator, but cannot be used in print. Both types re-render in response to changes made in the sheet, whereas interactive also re-renders based on user interaction with the diagram.

?> You can use Interactive & Static diagrams separately or combine together for the best experience!

| Feature               | Interactive | Static |
| --------------------- | ----------- | ------ |
| Render in Sheet       | ✅          | ✅     |
| Render in Print       |             | ✅     |
| SVG                   | ✅          | ✅     |
| JS/TS (incl bundling) | ✅          | ✅     |
| Full HTML             | ✅          |        |
| User interaction      | ✅          |        |

To start making your own custom diagram, follow the simple setup guide to start developing.

## Installation

1. Download [Source Code](https://github.com/ClearCalcs/custom-diagram-boilerplate/archive/refs/heads/main.zip) and unzip it. Alternatively, you can clone it from our [GitHub](https://github.com/ClearCalcs/custom-diagram-boilerplate).
2. NodeJS (version 19 or newer) _[https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)_
3. In your terminal navigate into the folder containing the code

```
cd path/to/repository/folder
```

3. Install NodeJS dependencies

```
npm install
```

## Local Testing: Interactive

### Starting the Development Server

For developing your widget, you can start a web server that will automatically update as you make code changes, by running:

```
npm start
```

?> Once you see `Server running at http://localhost:1234` in your terminal, you'll know the server is running.

This will start a server at [http://localhost:1234](http://localhost:1234), you can open this link in your browser to see your widget running. You should see something like this:

![Screenshot of the Development Server](_media/quick-start-guide/dev-server.png)

While this server is running, any code changes you make will automatically be updated in the browser. See [Building your widget](/quick-start-guide?id=developing) for more information on how to start building a widget.

### Starting the Test Runner

With the development server running, you can start the Test Runner. This will allow you to run your diagram in an environment that simulates the communication your widget will have with the ClearCalcs platform. In a new terminal or terminal tab at the folder of your code, run:

```
npm test
```

?> Once you see `Server running at http://localhost:4321` in your terminal, you'll know the test runner is running.

This will start another server [http://localhost:4321](http://localhost:4321), you can open this link in your browser to see the Test Runner. You should see the following, with your diagram in the box at the box at the top.

![Screenshot of the Test Runner](_media/quick-start-guide/testing-server.png)

The Test Runner will also update automatically with your code changes while it's running. See [Using the Test Runner](/interactive-diagram-test-runner) for more information on how get the most out of the test runner.

### Compilation

Once happy with changes, compile into a single html file at `output/index.html`.

```
npm run compile-interactive
```

## Local Testing: Static

### Compilation

While developing your static diagram widget, you'll need to generate a compiled file first into a single javascript file at `output/compiled.js` before testing rendering or params locally. This should be run initially or whenever code changes.

```
npm run compile-static
```

#### Testing render

1. Update the `tester/test.js` => `inputParams` with the parameter values the diagram expects.

```javascript
const inputParams = {
    circleFill: "red",
    rectFill: "blue",
};
```

2. Generate an SVG file. Output will be placed in `tester/out/diagram.svg`

```bash
npm run test-render
```

#### Testing params

1. Generate params. Output will be logged to the console and also saved into `tester/out/params.json`

```bash
npm run test-params
```

## Developing

With the html file and javascript file below, we create a diagram with 2 simple shapes. This diagram can be embedded into a calculator using the calculator builder, and the parameters `circleFill` and `rectFill` can be wired up to other inputs or equations.

-   [src/static/main.html](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/static/main.html)
-   [src/interactive/main.html](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/interactive/main.html)

```html
<svg id="svg" viewBox="0 0 500 100">
    <circle id="circle" cx="250" cy="50" r="50" fill="#ddd" />
    <rect id="rect" x="80" y="0" width="100" height="100" fill="#ddd" />
</svg>
```

-   [src/static/interface.ts](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/static/interface.ts)
-   [src/interactive/interface.ts](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/interactive/interface.ts)

For static diagram changes to `render`, see [Static Diagram Usage](/static-diagram-core?id=usage)

```javascript
export async function initialize() {} // interactive only

export async function render(params) {
    if (!!params.circleFill) {
        document
            .getElementById("circle")
            ?.setAttribute("fill", params.circleFill);
    }

    if (!!params.rectFill) {
        document.getElementById("rect")?.setAttribute("fill", params.rectFill);
    }
}

export async function params() {
    return [
        { key: "circleFill", type: "string" },
        { key: "rectFill", type: "string" },
    ];
}
```

On every change of the above parameters, the `render()` function is invoked automatically, causing the shapes' fill colours to be updated in sheet view (and print if using static diagram). `params()` is invoked only when the calculation is first built, to identify the parameters the diagram expects to react to changing values. `initialize()` will run whenever diagram is first loaded. Use this to initialize any variables event handlers before any render or params calls come in.

A detailed explanation of how diagrams are used in the ClearCalcs platform is available at [Using in ClearCalcs](/using-in-clearcalcs?id=using-in-clearcalcs "How diagrams are used inside ClearCalcs calculators")

## Adding User Interaction

### Introduction

ClearCalcs provides a range of common widgets for users to input data. The users can enter values which are then sent to the diagram via `params` on render. For more details see [Using in ClearCalcs](https://clearcalcs.github.io/custom-diagram-boilerplate/#/using-in-clearcalcs?id=building-calculators). These user-inputted values are synced with ClearCalcs and autosaved. However, for highly custom diagrams user input may need to be contextual to the diagram itself.

For example, let's consider a solar panel layout diagram, where individual panels may be included/excluded by the user. It is possible to pass in a list of panels to be removed from another widget and render them. However, the user would need to note the panel position and/or number on the diagram, subsequently enter the value(s) in the other widget.

An interactive diagram supporting user interaction would allow a user to simply click on the panel that needs adding/removing. The user's click action would be received by the custom diagram, which can forward this to ClearCalcs to save the value to the sheet. In this case, it is a simpler and more intuitive experience for the user.

### Adding interaction

Add an event handler in the `initialize` function in [src/interactive/interface.ts](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/interactive/interface.ts) that listens for user input.

Send data back to ClearCalcs by calling the `setStoredParams()` function with the new value.

List the storedParams that the diagram expects by implementing the `storedParams()` function.

```javascript
export async function initialize(getStoredParams, setStoredParams) {
    document.getElementById("svg")?.addEventListener("click", (event) => {
        if (event.target === document.getElementById("circle")) {
            setStoredParams({
                circleBorder:
                    getStoredParams().circleBorder === "red" ? "black" : "red",
            });
        }
    });
}

export async function storedParams() {
    return [{ key: "circleBorder", type: "string" }];
}
```

ClearCalcs will handle re-running `render` automatically and pass back the `circleBorder` in `getStoredParams()`. The diagram can then render changes to the DOM.

-   [src/interactive/render.ts](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/interactive/render.ts)

```javascript
export async function render(params, getStoredParams) {
    const storedParams = getStoredParams();
    ...
    if (!!storedParams.circleBorder) {
        document
            .getElementById("circle")
            ?.setAttribute("stroke", storedParams.circleBorder);
    }
}
```
