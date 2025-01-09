import * as esbuild from "esbuild";
import path from "path";
import { readFileSync } from "fs";

const font = readFileSync(
    "./svgdomPatches/scripts/fonts/OpenSans-Regular.json",
    "utf8",
);

const PATH_FILTERS = [
    // SVGDOM has a utility to assess the bounding box of text elements using DOM API getBBox()
    // however due to performance considerations, this has been removed.
    // This filter targets textUtils file imported by bboxUtils.js (to remove its fontkit dependency)
    // https://github.com/svgdotjs/svgdom/blob/0cf61d3d3d8be88c69304ec589ea035e606071f4/src/utils/bboxUtils.js#L73-L76
    // textUtils also imports node:path, which is not available in the isolated-vm environment.
    {
        namespace: "textUtils",
        filter: /^\.\/textUtils\.js$/,
        contents: readFileSync("./svgdomPatches/textUtils.js", "utf8"),
        loader: "js",
    },
    // SVGDOM uses the "image-size" library to to calculate image dimensions, which is not critical for the diagram developer.
    // This filter targets the HTMLImageElement file (to remove its dependency on the image-size package)
    // https://github.com/svgdotjs/svgdom/blob/0cf61d3d3d8be88c69304ec589ea035e606071f4/src/dom/html/HTMLImageElement.js#L1
    // The signature of the original image-size function is replicated per:
    // https://github.com/image-size/image-size/blob/9120bfb0b1dc0dab5456f22c94133b6fc3f5f0a4/lib/index.ts#L115
    {
        namespace: "image-size",
        filter: /^image-size$/,
        contents: `
            export default function imageSize (input, callback) {
                callback(null, { width: 0, height: 0 })
            }
        `,
        loader: "js",
    },
    // defaults.js is used for font-related configurations (which are no longer required).
    // It also imports the node:path module, which is not available in the isolated-vm environment.
    {
        namespace: "defaults",
        // - './src/utils/defaults.js' in main-modules.js
        // - '../utils/defaults.js' in src/dom/Window.js
        filter: /\/utils\/defaults\.js$/,
        contents: `export const fakeExport = "value";`,
        loader: "js",
    },
    // config.js is exported in the main-modules.js entrypoint to SVGDOM.
    // ESBuild therefore includes it even if it is never imported.
    // https://github.com/svgdotjs/svgdom/blob/0cf61d3d3d8be88c69304ec589ea035e606071f4/main-module.js#L31
    {
        namespace: "config",
        filter: /^\.\/src\/config\.js$/,
        contents: `export const fakeExport2 = "value";`,
        loader: "js",
    },
    // We are injecting hard-coded font metadata in place of the fontkit module
    // that will be injested by the substitute textUtils function
    {
        namespace: "fontfile",
        filter: /^OpenSans\-Regular\.json$/,
        contents: font,
        loader: "json",
    },
];

const svgDomPatch = {
    name: "patch-svgdom",
    setup(build) {
        PATH_FILTERS.forEach(({ namespace, filter, contents, loader }) => {
            build.onResolve({ filter }, (args) => ({
                path: args.path,
                namespace,
                pluginData: {
                    // Stores the directory of the imported file for resolving relative imports in the substituted file.
                    // For example, if "/src/utils/bboxUtils.js" imports "./other/textUtils.js",
                    // the resolveDir will be "src/utils/other".
                    resolveDir: path.dirname(
                        path.resolve(args.resolveDir, args.path),
                    ),
                },
            }));
            build.onLoad({ filter: /.*/, namespace }, (args) => ({
                contents,
                loader,
                resolveDir: args.pluginData.resolveDir,
            }));
        });
    },
};

try {
    await esbuild.build({
        entryPoints: ["src/static/interface.ts"],
        bundle: true,
        mainFields: ["module", "main"],
        platform: "neutral",
        format: "iife",
        // The iife format does not expose exports out of the entrypoint file
        // We need the render and params methods to be exposed at the top level
        // We can assign a name to the iife and pull them out from there.
        // https://github.com/evanw/esbuild/issues/2277
        globalName: "myDiagram",
        footer: {
            js: "var render = myDiagram.render; var params = myDiagram.params",
        },
        // TS declarations in custom.d.ts should be sync'ed with loaders
        loader: {
            ".html": "text",
            ".svg": "text",
        },
        outfile: "output/compiled.js",
        logLevel: "debug",
        plugins: [svgDomPatch],
    });
    console.log(
        "***\nSuccessfully compiled diagram into output/compiled.js\n***",
    );
} catch (e) {
    console.error("***\nCould not compile diagram\n***");
}
