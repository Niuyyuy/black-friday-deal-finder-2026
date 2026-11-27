[![black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Niuyyuy/black-friday-deal-finder-2026/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Niuyyuy/black-friday-deal-finder-2026/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

# Deal Beacon — Black Friday 2026

A static deal finder for Black Friday and Cyber Monday 2026: **28 real deals**, each read and checked on 27 November 2026, with the store, the sale price, the usual price, the discount, a link to the product at its store, and an honest verdict — *New low*, *Strong price*, or *Routine sale* — with the evidence behind it.

- Search across every deal, filter by category, store, discount and verdict, and sort by best verdict, biggest discount, most dollars saved, or price.
- The same product compared across stores where a second price was seen (AirPods Pro 3, MacBook Air M5, Beats Solo 4, Beats Studio Pro, Dyson V9).
- Works offline from its own files, on a desktop and on a phone. No network requests, no tracking.

## How it was built

Every price was read at the store or in a deals source that names the store, in the session that built this entry on 27 November 2026 — TradingView News, Yahoo Shopping, Best Buy's own Black Friday release, 9to5Google, ProductBible, Redmond Pie, Marathon Scout, and others. Each deal page names its source and the time it was checked. Prices can change; the site says so and tells shoppers to check the store before buying.

## Running it

Serve `app/` with any static server (it needs no build step):

```sh
cd app && python3 -m http.server 8080
```

Then open http://localhost:8080. The hand-in program at the root copies `app/` and `screenshots/` to the output directory and writes `dossier.json`:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Entry

- Competition: [black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01?ref=0wvmb34n) on make.fun
- License: MIT
