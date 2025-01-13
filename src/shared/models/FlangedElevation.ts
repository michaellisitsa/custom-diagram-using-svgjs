import { Container, extend, Line, Rect } from "@svgdotjs/svg.js";

export default class FlangedElevation extends Rect {
    // Create method to proportionally scale the rounded corners
    size(width: number, height: number): this {
        return this.attr({
            width: width,
            height: height,
        });
    }

    // Method to add a dashed line at a height just below the top of the shape
    addFlange(
        thickness: number,
        flange: "top" | "bottom",
        lineType: "solid" | "dashed" = "solid",
    ): this {
        const line = new Line()
            .plot(
                0,
                flange === "top" ? thickness : this.attr("height") - thickness,
                this.attr("width"),
                flange === "top" ? thickness : this.attr("height") - thickness,
            )
            .stroke({
                color: "#000",
                width: 1,
                dasharray: lineType === "dashed" ? "5,5" : "none",
            });
        this.parent()!.put(line);
        return this;
    }
}

extend(Container, {
    FlangedElevation: function (width, height) {
        return this.put(new FlangedElevation().size(width, height));
    },
});
