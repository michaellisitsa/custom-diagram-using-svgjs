# Interactive Diagram Core

## Execution Lifecycle

Each interactive diagram has an execution lifecycle that is hidden away from the diagram creator. When a user navigates to a sheet with a custom diagram, the three phases begin with loading, initializing, then rendering.

### 1. Load

The provided HTML markup and associated stylesheets are loaded into the DOM when a user opens a ClearCalcs calculator.

### 2. Initialize

The [initialize](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/interactive/interface.ts#L7) function is called automatically the first time the interactive diagram is loaded into a calculator.

#### Use Cases

-   Initializing third-party packages.
-   Data fetching e.g. GIS / CAD data.
-   Rendering initial state. This is useful where the diagram hasn't yet received any params e.g. builder's diagram widget.
-   Event listeners on user interaction e.g. click handlers.
-   Other async code that needs to run before `render` is called should be run here.

#### Params

1. `getStoredParams(void): storedParams`: Function returning a list of storedParams. For a new sheet, this will be default values set up in the template. If a user has interacted with the diagram previously, this will return the values previously provided by `setStoredParams`.
2. `setStoredParams(newStoredParams): void`: Function expecting a list of storedParams. This will send the values to ClearCalcs to process and store.

For practical examples, see [Best Practices: Setting Stored Parameters](/interactive-diagram-best-practices?id=setting-stored-parameters)

#### Return

Return is optional. If using await or returning a Promise, `render` will not be called until these are fulfilled.

1. `Promise<void>`

### 3. Render

The [render(params)](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/interactive/interface.ts#L21) function is called automatically whenever ClearCalcs receives a new set of `params` or `storedParams`. The diagram creator should update the DOM inside this function.

**Params**

1. `params`: Object containing all storedParams
2. `getStoredParams(void): storedParams`; Function returning a list of storedParams.

**Return**

1. `Promise<void>`

Any scripts, DOM elements or event listeners set up at the top-level of files, or inside of the `initialize` and `render` functions are maintained until the user navigates away from the sheet.

?> Invocations of `render` where async code is used should be done with caution. Multiple `render` invocations may occur in quick succession without waiting for the previous one to complete. Any DOM manipulations that occur after asynchronous code (e.g. network request) may be completed out of order.

## Developer tooling

The interactive custom diagram leverages modern developer tooling that can simplify the creation of complex diagrams with multiple files and dependencies whilst still compiling down to a html file that can be used inside of the user's browser. Much of this is enabled via the [Parcel](https://parceljs.org/) bundler. Features include:

-   Code compilation and minification
-   Asset importing e.g. images
-   Bundling dependencies
-   ESM Module Imports
-   Sass [link](https://sass-lang.com/): CSS stylesheets
-   Support for Typescript
-   Transpilation for older browser versions (i.e. last 2 years) - should not be changed
-   Test Runner with hot reloading

## Bundling

On running `npm run compile-interactive`, [Parcel](https://parceljs.org/) generates a html file that compiles your code along with all bundled dependencies.

Add dependency to `package.json` file in the "dependencies" section.

```
npm install
```

Test Runner will hot reload to include dependency
