import sourcemaps from "rollup-plugin-sourcemaps";
import commonjs from "rollup-plugin-commonjs";
import ts from "@wessberg/rollup-plugin-ts";
import paths from "rollup-plugin-ts-paths";
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
  plugins: [paths(), ts({ tsconfig: "tsconfig.build.json" }), sourcemaps(), commonjs()]
};
