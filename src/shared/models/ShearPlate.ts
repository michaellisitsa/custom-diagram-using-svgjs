import { Container, extend, Line, Rect, Svg, SVG } from "@svgdotjs/svg.js";

const BOLT_SIZE = 7;

export default class ShearPlate extends Rect {
    // Create method to proportionally scale the rounded corners
    size(width: number, height: number): this {
        return this.attr({
            width: width,
            height: height,
        });
    }

    addBoltLine(
        start,
        stop,
        num,
        offset = (this.attr("width") - BOLT_SIZE) / 2,
    ): this {
        const step = (stop - start) / (num - 1);
        const boltLocations = Array.from(
            { length: num },
            (_, i) => start + step * i,
        );
        boltLocations.forEach((location) => {
            const nested = (this.parent()! as Svg)
                .nested()
                .viewbox("0 0 500 500")
                .size(BOLT_SIZE, BOLT_SIZE)
                .move(offset, location - BOLT_SIZE / 2);
            nested.path(`M364.269,453.155H121.416L0,242.844L121.416,32.533h242.853l121.419,210.312L364.269,453.155z M131.905,434.997h221.878
                l110.939-192.152L353.783,50.691H131.905L20.966,242.844L131.905,434.997z`);
        });
        return this;
    }
}

extend(Container, {
    ShearPlate: function (width, height) {
        return this.put(new ShearPlate().size(width, height));
    },
});
