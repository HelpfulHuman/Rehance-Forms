import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.tsx",
  output: [
    { file: "dist/index.js", format: "cjs" },
    { file: "example/src/stateside/index.js", format: "cjs" },
    { file: "dist/index.es.js", format: "es" },
  ],
  exports: "named",
  external: ["react"],
  plugins: [
    resolve({ main: true, jsnext: true }),
    typescript(),
  ],
};