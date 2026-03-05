// tsdown.config.ts
import { defineConfig } from "tsdown";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: !isProduction,
  clean: true,
  outDir: "dist",
  deps: {
    skipNodeModulesBundle: true,
  },
});
