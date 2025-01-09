// Custom loaders used for static diagram. see static-build.js
// https://webpack.js.org/guides/typescript/#importing-other-assets
declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.html" {
    const content: string;
    export default content;
}
