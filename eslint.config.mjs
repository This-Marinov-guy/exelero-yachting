import { fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "@next/next": fixupPluginRules(nextPlugin) },
    rules: {
      ...js.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      // Core rules misread some TypeScript declarations and type-only usage.
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-redeclare": "off",
      // Existing route patterns escape characters in string literals.
      "no-useless-escape": "off",
    },
  },
];
