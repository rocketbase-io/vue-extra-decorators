import sourcemaps from "rollup-plugin-sourcemaps";
import commonjs from "rollup-plugin-commonjs";
import ts from "@wessberg/rollup-plugin-ts";
import paths from "rollup-plugin-ts-paths";
import execute from "@rocketbase/rollup-plugin-exec";
import { name, globals, external } from "./package";
import banner from "./banner";

export default {
  input: "src/main.ts",
  output: ["umd", "iife", "esm", "cjs"].map(format => ({
    file: `dist/${name}${format === "umd" ? "" : `.${format}`}.js`,
    exports: "named",
    sourcemap: true,
    format,
    globals,
    name,
    banner
  })),
  external,
  plugins: [
    paths(),
    ts({ tsconfig: "tsconfig.build.json" }),
    sourcemaps(),
    commonjs(),
    execute(
      ["typedoc", "rimraf temp dist/*.*.d.ts", `bestzip '${name}.zip' dist/*`, `bestzip '${name}-docs.zip' docs/*`],
      {
        stdio: "ignore",
        once: true
      }
    )
  ]
};
