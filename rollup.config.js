import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.tsx",
  output: [
    { file: "dist/index.js", format: "cjs" },
    { file: "dist/index.es.js", format: "es" },
    // { file: "example/src/lib/index.js", format: "cjs" }
  ],
  preferBuiltins: true,
  exports: "named",
  external: ["events", "react"],
  plugins: [
    resolve({ main: true, jsnext: true }),
    typescript()
  ]
};
