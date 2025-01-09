import { Resolver } from "@parcel/plugin";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default new Resolver({
    async resolve({ specifier }) {
        if (
            specifier === "../../src/interactive/interface" &&
            process.env.EXAMPLE_PATH
        ) {
            return {
                filePath: path.join(__dirname, process.env.EXAMPLE_PATH),
            };
        }

        // Let the next resolver in the pipeline handle
        // this dependency.
        return null;
    },
});
