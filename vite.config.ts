// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
// Ensure production NODE_ENV during build so React 19 uses production jsx-runtime (not jsxDEV)
if (process.env["NODE_ENV"] === undefined && (process.argv.includes("build") || process.argv.includes("--mode"))) {
  process.env["NODE_ENV"] = "production";
}

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: process.env.NITRO_PRESET || "vercel",
  },
  vite: {
    ...({
      esbuild: {
        jsxDev: false,
      },
      oxc: {
        jsx: {
          development: false,
        },
      },
    } as any),
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
