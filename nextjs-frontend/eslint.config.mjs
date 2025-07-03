import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "unused-imports/no-unused-imports": "error",
    },
  },
];

export default eslintConfig;
