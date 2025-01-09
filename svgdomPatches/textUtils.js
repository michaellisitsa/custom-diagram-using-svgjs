// No font dependency implementation of svgdom textUtils
// https://github.com/svgdotjs/svgdom/blob/master/src/utils/textUtils.js

import { Box, NoBox } from "../other/Box.js";
// Use hard-coded font metadata instead of fontkit
import font from "OpenSans-Regular.json";

export const textBBox = function (text, x, y, details) {
    if (!text) return new NoBox();

    // Fallback font size not imported from defaults.js any more.
    const fontSize = details.fontSize || 16;
    const fontHeight = font.ascent - font.descent;
    const lineHeight = fontHeight > font.unitsPerEm ? fontHeight : fontHeight + font.lineGap;

    const height = (lineHeight / font.unitsPerEm) * fontSize;
    // Use hard-coded font character widths from compiled font or fallback width
    // The original gets the advanceWidth from `font.layout(text)` which returns an array of glyphs and their metadta
    // Our advanceWidths are stored in a pre-compiled JSON object for common characters
    const width = Array.from(text).reduce((last, curr) => last + font.advanceWidths[curr] || font.advanceWidthsFallback, 0) * fontSize;

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
    let xAdjust = 0;
    if (details.textAnchor === "end") {
        xAdjust = -width;
    } else if (details.textAnchor === "middle") {
        xAdjust = -width / 2;
    }

    // https://www.w3.org/TR/2002/WD-css3-linebox-20020515/
    // 4.2. Baseline identifiers
    let yAdjust = font.ascent; // alphabetic
    if (details.dominantBaseline === "before-edge" || details.dominantBaseline === "text-before-edge") {
        yAdjust = 0;
    } else if (details.dominantBaseline === "hanging") {
        yAdjust = font.ascent - font.xHeight - font.capHeight;
    } else if (details.dominantBaseline === "mathematical") {
        yAdjust = font.ascent - font.xHeight;
    } else if (details.dominantBaseline === "middle") {
        yAdjust = font.ascent - font.xHeight / 2;
    } else if (details.dominantBaseline === "central") {
        yAdjust = font.ascent / 2 + font.descent / 2;
    } else if (details.dominantBaseline === "ideographic") {
        yAdjust = font.ascent + font.descent;
    }
    return new Box(x + xAdjust, y - (yAdjust / font.unitsPerEm) * fontSize, width, height);
};
