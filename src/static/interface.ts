import { createSVGWindow } from "svgdom";
import { SVG, registerWindow } from "@svgdotjs/svg.js";

import {
    ParamsResponse,
    StoredParamsResponse,
    paramsTypes,
} from "../shared/ParamsInterface";
import { update } from "../shared/render";

const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);

const canvas = SVG(document.documentElement as SVGSVGElement);

export function render(
    params: ParamsResponse,
    storedParams: StoredParamsResponse,
) {
    return update(params, storedParams, { canvas });
}

export function params() {
    return paramsTypes;
}
