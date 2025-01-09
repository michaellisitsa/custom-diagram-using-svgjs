# Using Test Runner

## Introduction

The Test Runner allows visualisation of the custom interactive diagram and how it responds to each function that is user implemented such as `render`, `initialize`, `params` and `dimensions`. It enables quick, iterative development of the custom diagram in an environment that mimics the ClearCalcs app for maximum compatibility when it is deployed in a real calculator.

It allows this compatibility by running the diagram code within a fake ClearCalcs app that has the same capabilities and restrictions. The following diagram functionality may be tested:

### Supported Features

-   renders initial visual state without parameters
-   updates visual state after render() called
-   returns expected parameters after params() called
-   reports its own dimensions after dimensions() called
-   returns error response when timing out or throwing an error.

![Screenshot of the Test Runner](_media/quick-start-guide/testing-server.png)

### Unsupported Features

User interaction is currently not supported in the test runner. The following limitations are present when loading a diagram expecting user interaction:

-   `getStoredParams()` will return an empty object.
-   `setStoredParams()` will not update storedParams, and render will not be fired automatically.

User interaction may be tested by compiling and uploading the diagram to the builder. For detailed instructions, see [Using in ClearCalcs](/using-in-clearcalcs).

## Set up

For setting up the test runner, see Quick start guide [Starting the Test Runner](/quick-start-guide?id=starting-the-test-runner)

The web page needs to be refreshed every time the code changes.

?> When setting up the test runner, 2 web servers are launched.
`npm start` serves the custom diagram code, uncompiled. `npm run test` launches the fake ClearCalcs app which renders the custom diagram in an iframe, and initiates communication with it.

## Function Calls

| Method     | Data        | Output                                  |
| ---------- | ----------- | --------------------------------------- |
| dimensions | -           | JSON containing:<br>`width`<br>`height` |
| initialize | -           | returned value                          |
| render     | JSON object | returned value                          |
| params     | -           | JSON containing params                  |

-   Where an error or timeout occurs, the output value will display the error message instead.
-   Where a Promise is returned, output is delayed until it resolves

### Dimensions

The interactive diagram is displayed without overflow in the ClearCalcs app. Since iframes do not resize automatically based on their vertical content height, a special internal message `dimensions` is sent from the diagram to ClearCalcs whenever the `document.body` => `border-box` changes size. This message is then used to allocate the correct amount of space in ClearCalcs.

Typically this should just work, however, where issues are occurring with too much padding or cut-off content, this method can be called to verify what the `dimensions` is actually returning.

Example:

```js
// Received `dimensions` call (...), with:-
{
    "width": 800,
    "height": 387
}
```

### Initialize

This function will be run once automatically on starting the test runner, however, it can be triggered manually if you want to test its effect on the diagram.

### Render

The render method can be called to see how the diagram updates when a new set of values is provided.

To use this function, add a valid object of parameters into the text area with label "data". It should contain an object with keys for all parameters your diagram expects. The values for each key may be any types that the diagram can receive from ClearCalcs.

-   `string`
-   `number`
-   `array`: may be nested, containing only strings or numbers
-   `object`: may be nested, containing any of the above.

If there is a formula or reference to another widget that is usually entered in ClearCalcs, this needs to be converted back to above data types. Units from [mathjs](https://mathjs.org/) cannot be used.

?> The test runner directly calls `eval()` on the entered params, whereas ClearCalcs app evaluates formulas using [mathjs](https://mathjs.org/). These are not equivalent.

```js
{
    myString: "red",
    myNumber: 2,
    myArray: [1,2,3],
    myObject: {a: 1, b: 2}
}
```

This will be the most commonly called method to regenerate the diagram according to the input parameters.

### Params

The return value of the params method is outputted.
