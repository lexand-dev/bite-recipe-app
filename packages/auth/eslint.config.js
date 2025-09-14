import baseConfig, { restrictEnvAccess } from "@bite/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["script/**"],
  },
  ...baseConfig,
  ...restrictEnvAccess,
];
