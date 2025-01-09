// File modified from original
// https://github.com/svgdotjs/svgdom/blob/master/src/utils/textUtils.js
// to run at build time rather at runtime, for performance improvement
// Font object has been simplified:
// - only include properties used by SVGDOM for getBBox()
// - only include advanceWidths for common characters

import * as fontkit from "fontkit";
import { writeFileSync } from "fs";

const fontName = "OpenSans-Regular";

const font = fontkit.openSync(`svgdomPatches/scripts/fonts/${fontName}.ttf`);

const CHAR_CODES_RANGES = [
    [32, 47], // Space and punctuation marks: !"#$%&'()*+,-./
    [48, 57], // Digits: 0-9
    [58, 64], // Punctuation and special characters: :;<=>?@
    [65, 90], // Uppercase letters: A-Z
    [91, 96], // Punctuation and special characters: [\]^_`
    [97, 122], // Lowercase letters: a-z
    [123, 126], // Punctuation and special characters: {|}~
];

let advanceWidths = {};
CHAR_CODES_RANGES.forEach((range) => {
    for (let i = range[0]; i <= range[1]; i++) {
        const text = String.fromCharCode(i);
        // Normalized advance width is calculated because fontSize is not known at build time.
        advanceWidths[text] = font.layout(text).glyphs.reduce((last, curr) => last + curr.advanceWidth, 0) / font.unitsPerEm;
    }
});

let fontData = {
    ascent: font.ascent,
    descent: font.descent,
    unitsPerEm: font.unitsPerEm,
    lineGap: font.lineGap,
    xHeight: font.xHeight,
    capHeight: font.capHeight,
    advanceWidthsFallback: advanceWidths["A"],
    advanceWidths,
};

const exportedFileName = `svgdomPatches/scripts/fonts/${fontName}.json`;
writeFileSync(exportedFileName, JSON.stringify(fontData, null, 2));

console.log(`***\nSuccessfully compiled font metadata\n${exportedFileName}\n***`);
