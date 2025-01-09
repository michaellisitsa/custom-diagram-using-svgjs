import {
    ParamsResponse,
    StoredParamsResponse,
    paramsTypes,
} from "../shared/ParamsInterface";
import { update } from "./render";
import { SVG, extend as SVGextend, Container, Rect } from "@svgdotjs/svg.js";

export async function initialize(getStoredParams, setStoredParams) {
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
    }

    // Add a method to create a rounded rect
    SVGextend(Container, {
        rounded: function (width: number, height: number) {
            return this.put(new Rounded()).size(width, height);
        },
    });

    return update({} as ParamsResponse);
}

export async function render(params: ParamsResponse, getStoredParams) {
    return update(params);
}

export async function params() {
    return paramsTypes;
}

export async function storedParams() {
    return [];
}
