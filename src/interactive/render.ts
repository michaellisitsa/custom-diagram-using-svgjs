import { SVG } from "@svgdotjs/svg.js";

export function update(params) {
    // Simple example
    var draw = SVG().addTo("body").size(300, 300);
    var rect = draw.rect(100, 100).attr({ fill: "#f06" });

    // Adding a group
    var group = draw.group();
    group.add(rect);
    const path = group.path("M10,20L30,40");
    path.stroke({ color: "black", width: 2, linecap: "round" });
    path.move(10, 100);
    const rounded = group.rounded(200, 100).fill("green").move(10, 100);
}
