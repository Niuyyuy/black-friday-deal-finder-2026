// Deal Beacon's hand-in program (Node 22, standard library only). The site
// itself is plain static files under app/ — index.html, its stylesheets and
// modules, and the deals in data.js — and the screenshots beside them. This
// program copies both folders into the output directory the grader reads
// and writes dossier.json there, using the vendored make.fun library, which
// is the summary the judge reads: the screenshots, the first load's files
// and bytes, and the site's source. vendor/makefun-frontend.ts stays as the
// kit shipped it, because the scorer rebuilds the dossier with its own copy
// and the two must match byte for byte.
//
// Run it outside the grader with an output directory of your own:
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The scorer's own caps, so a hand-in that would fail the gate fails here
// first: at most 4 screenshots, none over 256 KiB; app/ at most 993 files
// and directories and 16 MiB in all; the dossier text capped at 160 KiB.
// A one-line summary on stdout says the hand-in is ready to be checked.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
console.log(`Deal Beacon handed in to ${out} (dossier.json written).`);
