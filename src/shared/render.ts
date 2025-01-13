import { SVG, Svg } from "@svgdotjs/svg.js";
import { extend, Container } from "@svgdotjs/svg.js";
// This extends SVG.js to included additional classes
import "./models/index";
import { defaultParams } from "./ParamsInterface";

type Options = {
    canvas: Svg;
};

export function update(params, storedParams, options: Options) {
    const { columnDepth, columnFlangeTf, beamDepth, beamFlangeTf } =
        params || defaultParams;
    const canvasHeight = 2 * beamDepth;
    const canvasWidth = 3 * columnDepth;
    const draw = options.canvas;

    draw.viewbox(0, 0, canvasWidth, canvasHeight);

    const columnGroup = draw
        .group()
        .transform({ translate: [0, -columnDepth] })
        .rotate(90, 0, columnDepth);
    const column = columnGroup
        .FlangedElevation(canvasHeight, columnDepth)
        .addFlange(columnFlangeTf, "top", "dashed")
        .addFlange(columnFlangeTf, "bottom", "dashed")
        .fill("none")
        .stroke("black");

    const beamGroup = draw.group().transform({
        translate: [columnDepth, canvasHeight / 2 - beamDepth / 2],
    });
    const beam = beamGroup
        .FlangedElevation(canvasWidth - columnDepth, beamDepth)
        .addFlange(beamFlangeTf, "top", "solid")
        .addFlange(beamFlangeTf, "bottom", "solid")
        .fill("none")
        .stroke("black");

    const ShearPlateLength = 80;

    const ShearPlateGroup = beamGroup.group().transform({
        translate: [0, (beamDepth - ShearPlateLength) / 2],
    });

    const ShearPlate = ShearPlateGroup
        // thickness, length
        .ShearPlate(20, ShearPlateLength)
        .fill("none")
        .stroke("black")
        // start, stop, numb
        .addBoltLine(10, ShearPlateLength - 10, 5);

    return options.canvas?.svg();
}
