# Using in ClearCalcs

ClearCalcs is a platform for structural engineers to use calculators to design safe structures such as buildings and civil infrastructure.

Find out more by visiting [https://clearcalcs.com/](https://clearcalcs.com/).

## Sign Up

To work with a custom diagram inside of ClearCalcs, you will need to sign up for a free account and request access to the builder.

1. Sign up via [https://clearcalcs.com/signup](https://clearcalcs.com/signup)
2. Request access to builder by contacting [support@clearcalcs.com](mailto:support@clearcalcs.com)
3. Once confirmed, you will see a "Calculator Builder" icon in the sidebar when you log in.

## Building Calculators

### Introduction

The builder is a web-based calculator creator. All ClearCalcs calculators are added and updated regularly via the builder (for examples see [Free Engineering Tools](https://clearcalcs.com/freetools)). Each calculator is built out of individual widgets such as:

-   **Input** displays a text box accepting user input
-   **Computed** displays a label with the results of maths equations
-   **Diagram** rendering a diagram created based on this guide.

### Building

1. Drag some widgets for anything the diagram will need to accept via render params. For more details about each widget type and how they can be used, see [Builder Quick Start Guide](https://app.clickup.com/6927027/v/dc/6kcnk-1766/6kcnk-147976)
2. Drag a Diagram widget and click on the "Edit Diagram" button.

<div style="text-align: center;">

![Screenshot of the builder](_media/using-in-clearcalcs/builder-main-page.png ":size=600")

</div>

3. Upload `output/index.html` (interactive diagram) and/or `output/compiled.js` (static diagram) into the ClearCalcs builder. The default example is shown with interactive circle border [src/static/interface.ts](https://github.com/ClearCalcs/custom-diagram-boilerplate/blob/main/src/static/interface.ts) included.
4. Add values or references to other sheet widgets against each param. The storedParams keys will also be listed.

![Screenshot of the builder custom diagram editor](_media/about/builder-screenshot.png)

5. Select Preset Editor tab and add default values that the users will see on first entering the template.

<div style="text-align: center;">

![Screenshot of the builder preset editor lookups](_media/using-in-clearcalcs/builder-preset-inputs.png ":size=500")

</div>

6. If the diagram accepts user interaction, also click on the diagram to toggle the default state. Any equations that depend on the storedParams will change from grey triangle to a valid result. The diagram will also be highlighted green.

<div style="text-align: center;">

![Screenshot of the builder preset editor interactive diagram](_media/using-in-clearcalcs/builder-preset-interactive.png ":size=400")

</div>

7. If the diagram accepts user interaction, you can use the result of the storedParams in other widgets.

<div style="text-align: center;">

![Screenshot of using storedParams in equation](_media/using-in-clearcalcs/builder-using-storedParams.png ":size=500")

</div>

### Publishing

1. Select the current preset created above and click Preview (top-right)
2. See the diagram reacting when other widgets are changed

<div style="text-align: center;">

![Screenshot of the custom diagram in sheet view](_media/using-in-clearcalcs/builder-preview.png ":size=500")

</div>

3. Contact ClearCalcs staff to publish calculators created in the builder for use by all paying customers.
4. It is also possible to publish calculators only usable in your organisation via the builder. See guide to publishing [Calculator Publishing](https://doc.clickup.com/6927027/p/h/6kcnk-147776/9ba20c422155161)

## Using Calculators

Calculators that are published can be accessed in your project. For a quick guide on how to use, see:

[Getting Started 3 Simple Steps](https://clearcalcs.com/support/get-started-with-clearcalcs/getting-started-3-simple-steps-for-success)

The calculators may be exported to PDF to verify that the diagram correctly renders.

[Exporting Calculations](https://clearcalcs.com/support/get-started-with-clearcalcs/exporting-calculations-and-member-schedule)
