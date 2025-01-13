import { SVG, Svg } from "@svgdotjs/svg.js";
import { extend, Container } from "@svgdotjs/svg.js";
// This extends SVG.js to included additional classes
import "./models/index";
import { defaultParams } from "./ParamsInterface";

type Options = {
    canvas: Svg;
};

const CANVAS_HEIGHT = 300;
const CANVAS_WIDTH = 500;

export function update(params, storedParams, options: Options) {
    const draw = options.canvas;

    draw.viewbox(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const { columnDepth, columnFlangeTf, beamDepth, beamFlangeTf } =
        params || defaultParams;
    const columnGroup = draw
        .group()
        .transform({ translate: [0, -columnDepth] })
        .rotate(90, 0, columnDepth);
    const column = columnGroup
        .FlangedElevation(CANVAS_WIDTH, columnDepth)
        .addFlange(columnFlangeTf, "top", "dashed")
        .addFlange(columnFlangeTf, "bottom", "dashed")
        .fill("none")
        .stroke("black");

    const beamGroup = draw.group().transform({
        translate: [columnDepth, CANVAS_HEIGHT / 2 - beamDepth / 2],
    });
    const beam = beamGroup
        .FlangedElevation(CANVAS_WIDTH - columnDepth, beamDepth)
        .addFlange(beamFlangeTf, "top", "solid")
        .addFlange(beamFlangeTf, "bottom", "solid")
        .fill("none")
        .stroke("black");

    return options.canvas?.svg();
}
