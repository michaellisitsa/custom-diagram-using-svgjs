import { SVG } from "@svgdotjs/svg.js";
import {
    ParamsResponse,
    StoredParamsResponse,
    defaultParams,
    paramsTypes,
} from "../shared/ParamsInterface";
import { update } from "../shared/render";

const canvas = SVG().addTo("body");

export async function initialize(getStoredParams, setStoredParams) {
    const storedParams = getStoredParams();

    return update(defaultParams, storedParams, { canvas });
}

export async function render(params: ParamsResponse, getStoredParams) {
    const storedParams = getStoredParams();
    canvas.clear();
    return update(params, storedParams, { canvas });
}

export async function params() {
    return paramsTypes;
}

export async function storedParams() {
    return [];
}
