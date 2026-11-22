// Bundles lib/forms/auto.ts (strict form checks + sending) into public/js/form-guard.js for the service pages.
import { build } from "esbuild";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
await build({
  entryPoints: [`${root}lib/forms/auto.ts`],
  outfile: `${root}public/js/form-guard.js`,
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2019",
  banner: { js: "/* Effix Labs form checks. Generated from lib/forms by `npm run build:forms`; do not edit. */" },
  logLevel: "warning",
});
console.log("built public/js/form-guard.js");
