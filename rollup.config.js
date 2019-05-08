import ts from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import typescript from "typescript";
import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    { file: "dist/index.js", format: "cjs" },
    { file: "dist/index.es.js", format: "es" },
  ],
  preferBuiltins: true,
  exports: "named",
  external: [].concat(
    Object.keys(pkg.dependencies || {}),
    Object.keys(pkg.peerDependencies || {}),
  ),
  plugins: [
    resolve(),
    ts({ typescript }),
  ]
};
