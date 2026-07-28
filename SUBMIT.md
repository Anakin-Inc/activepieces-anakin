# Activepieces — submission instructions

## Important: not the same process the older research assumed

`CONTRIBUTING.md` in `activepieces/activepieces` currently pauses unsolicited
outside PRs to the main repo ("a large share of incoming PRs are now
AI-generated" — their words, a temporary anti-spam measure). The doc
explicitly redirects third parties to publish as a **standalone npm
package** instead of a PR into their monorepo. That's what this is.

## What's here and how it was verified

```
src/index.ts                              createPiece — 5 actions, no triggers
src/lib/auth.ts                           API key auth + validate()
src/lib/common.ts                         base URL constant
src/lib/actions/scrape-url.ts             submit a scrape job
src/lib/actions/get-scrape-result.ts      poll it
src/lib/actions/search.ts                 synchronous AI search
src/lib/actions/agentic-search.ts         submit an agentic research job
src/lib/actions/get-agentic-search-result.ts   poll it
```

**Actually installed and typechecked** against the real, currently-published
npm packages (`@activepieces/pieces-framework@0.32.0`,
`@activepieces/pieces-common@0.12.5`, `@activepieces/shared@0.96.2` — npm
registry access worked in this sandbox even though PyPI access didn't, so
this one got the same live-verification treatment as the n8n/Botpress/Zed
work). `npm run build` produces a real `dist/`. Caught and fixed two real
bugs this way, not hypothetical:

1. **`PieceCategory` isn't exported from `@activepieces/pieces-framework`**
   — it actually lives in `@activepieces/shared` (confirmed by reading the
   framework's own `.d.ts` source in `node_modules` after the import
   failed). The reference examples pulled from the monorepo
   (`firecrawl`, `airtable`) don't surface this because in-repo pieces
   import from workspace-linked sources where the re-export might resolve
   differently; the standalone npm-published package does not re-export it.
2. **`auth as string` was wrong in every action file** — `context.auth` for
   a `PieceAuth.SecretText` field is a `SecretTextConnectionValue` object,
   not a raw string; the real field is `auth.secret_text` (this matches
   what Firecrawl's and Airtable's actual `run()` implementations do —
   verified against their real source, not assumed — the mistake was in my
   first draft, not the reference pattern).

## Design choices worth knowing

- **Two actions per async operation (submit + poll), not one action with an
  internal loop.** This matches Activepieces' own convention exactly —
  Firecrawl's real piece has separate `crawl` and `crawlResults` actions —
  because Activepieces flows model "wait" as its own step (a Delay action
  between the two), not something a single action should do internally.
  Same shape as the "Delay" steps already documented in
  `../zapier-make-recipes/asana.md` and `clickup.md` for the equivalent
  Zapier/Make pattern.
- **`auth.validate()` calls a real (paid) endpoint** — `search` with
  `limit: 1`, 3 credits — to verify the key on explicit user connect,
  matching Firecrawl's and Airtable's own validate() pattern (both call a
  real endpoint). This is a deliberate difference from the Botpress
  integration elsewhere in this session, which skips eager validation
  entirely: Botpress's `register()` can fire on more implicit/automatic
  occasions, while Activepieces' `validate()` only runs once, on the user's
  explicit "connect" action — closer to intentional, expected cost.

## Steps (needs the account owner)

1. `npm publish` under the `@anakin-io` npm org (or drop the scope if
   publishing unscoped) — needs npm credentials.
2. Install into a real Activepieces instance (Settings → My Pieces →
   Install Piece → package name) and test all 5 actions against a live key
   — never done, this was verified by typecheck/build only.
3. Optionally file a GitHub Discussion or reach out on their Discord about
   getting it added to the curated pieces list once the outside-PR pause
   lifts.

## Not done

Typechecks and builds against the real published dependencies, but has
never run inside an actual Activepieces flow — needs the account owner to
publish and install it for that.
