import { createSVGWindow } from "svgdom";
import main_html from "./main.html";
import logo_svg from "./assets/clearcalcs.svg";
import {
    ParamsResponse,
    StoredParamsResponse,
} from "../shared/ParamsInterface";

const windowObj = createSVGWindow();
const SVG_ROOT = windowObj.document.documentElement as SVGSVGElement;

// Append the main html to the SVG root
SVG_ROOT.innerHTML = main_html;

// We want to merge the attributes of the first child from main_html file,
// into the SVG element provided by the SVGDOM library, SVG_ROOT.
// This allows us to merge the 2 nested SVG elements into 1
// and resolves issues with Weasyprint sizing nested SVGs incorrectly.
(SVG_ROOT.children[0] as any).attrs?.forEach((attr) => {
    SVG_ROOT.setAttribute(attr.name, attr.value);
});

SVG_ROOT.innerHTML = SVG_ROOT.children[0].innerHTML;

const defaultParams: ParamsResponse = {
    circleFill: "red",
    rectFill: "blue",
    triangleFill: "green",
};

export default function update(
    params?: ParamsResponse,
    storedParams?: StoredParamsResponse,
) {
    const { circleFill, rectFill, triangleFill } = params || defaultParams;
    SVG_ROOT!.querySelector("#circle")?.setAttribute("fill", circleFill);

    SVG_ROOT!.querySelector("#rect")?.setAttribute("fill", rectFill);

    SVG_ROOT!.querySelector("#triangle")?.setAttribute("fill", triangleFill);
    SVG_ROOT!.querySelector("#clearcalcs-logo")!.innerHTML = logo_svg;
    // // EXAMPLE (FROM USER INTERACTION)
    // if (!!storedParams?.circleBorder) {
    //     SVG_ROOT!.querySelector("#circle")?.setAttribute("stroke", storedParams.circleBorder);
    // }
    return SVG_ROOT.outerHTML;
}
