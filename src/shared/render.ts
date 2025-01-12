import {
    SVG,
    extend as SVGextend,
    Container,
    Rect,
    Line,
    Svg,
} from "@svgdotjs/svg.js";

type Options = {
    canvas?: Svg;
};

export function update(params, storedParams, options: Options = {}) {
    class Rounded extends Rect {
        // Create method to proportionally scale the rounded corners
        size(width: number, height: number) {
            return this.attr({
                width: width,
                height: height,
                rx: height / 5,
                ry: height / 5,
            });
        }

        // Method to add a dashed line at a height just below the top of the shape
        addDashedLine(thickness: number) {
            const line = new Line()
                .plot(0, thickness, this.attr("width"), thickness)
                .stroke({
                    color: "#000",
                    width: 2,
                    dasharray: "5,5",
                });
            this.parent()!.put(line);
            return this;
        }
    }

    // Add a method to create a rounded rect
    SVGextend(Container, {
        rounded: function (width: number, height: number) {
            return this.put(new Rounded()).size(width, height);
        },
    });

    const draw = options?.canvas
        ? options.canvas
        : SVG().addTo("body").size(300, 300);
    // Simple example

    // Adding a group
    var group = draw.group();
    const path = group.path("M10,20L30,40");
    const rounded = group
        .rounded(200, 100)
        .addDashedLine(10)
        .addDashedLine(90)
        .fill("green")
        .move(10, 100);

    return options.canvas?.svg();
}
