// tsup.config.ts
import { defineConfig } from "tsup";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  minify: isProduction,
  clean: true,
  outDir: "dist",
  skipNodeModulesBundle: true,
});
