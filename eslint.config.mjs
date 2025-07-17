import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable problematic TypeScript rules for 3D graph library integration
      "@typescript-eslint/no-explicit-any": "off",
      
      // Disable React hooks exhaustive deps warnings for complex dependencies
      "react-hooks/exhaustive-deps": "warn",
      
      // Disable Next.js module variable assignment rule for dynamic imports
      "@next/next/no-assign-module-variable": "off",
      
      // Disable React unescaped entities rule for content with quotes
      "react/no-unescaped-entities": "off",
      
      // Disable unused vars for imported components that might be used conditionally
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true 
      }],
      
      // Allow prefer-const warnings instead of errors
      "prefer-const": "warn"
    }
  }
];

export default eslintConfig;
