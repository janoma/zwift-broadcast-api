import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["./src/**/*.ts"] },
  { ignores: ["dist", "node_modules", "**/*.js"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
];
