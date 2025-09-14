import { createJiti } from "jiti";
import path from "path";
import { fileURLToPath } from "url";

const jiti = createJiti(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
await jiti.import("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@bite/api",
    "@bite/auth",
    "@bite/db",
    "@bite/ui",
    "@bite/validators",
  ],

  /** Set the correct workspace root to avoid lockfile confusion */
  outputFileTracingRoot: path.resolve(__dirname, "../../"),

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
