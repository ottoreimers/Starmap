import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      indent: ["error", "tab"],
      "react/jsx-indent": ["error", "tab"],
      "react/jsx-indent-props": ["error", "tab"],
    },
  },
];

export default eslintConfig;
