import { SVG } from "@svgdotjs/svg.js";

export function update(params) {
    // Simple example
    var draw = SVG().addTo("body").size(300, 300);

    // Adding a group
    var group = draw.group();
    const path = group.path("M10,20L30,40");
    const rounded = group
        .rounded(200, 100)
        .addDashedLine(10)
        .addDashedLine(90)
        .fill("green")
        .move(10, 100);
}
