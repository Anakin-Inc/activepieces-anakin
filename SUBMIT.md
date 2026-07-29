# Activepieces — submission instructions

## Important: not the same process the older research assumed

`CONTRIBUTING.md` in `activepieces/activepieces` currently pauses unsolicited
outside PRs to the main repo ("a large share of incoming PRs are now
AI-generated" — their words, a temporary anti-spam measure). The doc
explicitly redirects third parties to publish as a **standalone npm
package** instead of a PR into their monorepo. That's what this is.

## What's here and how it was verified

```
src/index.ts                              createPiece — 28 actions, no triggers
src/lib/auth.ts                           API key auth + validate()
src/lib/common.ts                         base URL constant

# Scraping / search (original 5)
src/lib/actions/scrape-url.ts             submit a scrape job
src/lib/actions/get-scrape-result.ts      poll it
src/lib/actions/search.ts                 synchronous AI search
src/lib/actions/agentic-search.ts         submit an agentic research job
src/lib/actions/get-agentic-search-result.ts   poll it

# Site discovery (map / crawl)
src/lib/actions/map-url.ts                submit a map (URL-discovery) job
src/lib/actions/get-map-result.ts         poll it
src/lib/actions/crawl-website.ts          submit a bulk-fetch crawl job
src/lib/actions/get-crawl-result.ts       poll it

# Wire — catalog of pre-built site actions (read + write)
src/lib/actions/wire-discover.ts          NL intent → ranked candidate actions
src/lib/actions/wire-catalog.ts           browse catalogs / one catalog's actions
src/lib/actions/wire-run-read-action.ts   run a data-extraction Wire action
src/lib/actions/wire-run-write-action.ts  run a state-changing Wire action
src/lib/actions/get-wire-job-result.ts    poll a Wire job (shared by both above)
src/lib/actions/wire-identities.ts        list saved identities/credentials
src/lib/actions/wire-login.ts             credentials-mode sign-in → credential_id
src/lib/actions/wire-build.ts             request a new Wire action for a new site

# Website Monitoring
src/lib/actions/monitor-create.ts         create a scheduled watch
src/lib/actions/monitor-list.ts           list monitors / fetch one
src/lib/actions/monitor-changes.ts        fetch a monitor's detected changes
src/lib/actions/monitor-control.ts        pause / resume / run_now / delete

# AI Visibility
src/lib/actions/ai-visibility-search.ts       submit a multi-engine AI-answer query
src/lib/actions/get-ai-visibility-result.ts   poll it
src/lib/actions/ai-visibility-sources.ts      list available AI engines

# Browser sessions (discovery/cleanup only — creation is an interactive dashboard flow)
src/lib/actions/session-list.ts           list saved login sessions
src/lib/actions/session-delete.ts         delete a saved session

# AI browser automation
src/lib/actions/browser-task.ts           submit a natural-language browser task
src/lib/actions/get-browser-task-result.ts    poll it
```

**Actually installed and typechecked** against the real, currently-published
npm packages (`@activepieces/pieces-framework@0.32.0`,
`@activepieces/pieces-common@0.12.5`, `@activepieces/shared@0.96.2` — npm
registry access worked in this sandbox even though PyPI access didn't, so
this one got the same live-verification treatment as the n8n/Botpress/Zed
work). `npm run build` produces a real `dist/`; `node -e "require('./dist/src/index.js')"`
confirms all 28 actions register under unique names with no load-time errors.
Caught and fixed two real bugs this way in the original 5-action version, not
hypothetical:

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
  Zapier/Make pattern. Applied consistently to every async endpoint added in
  this pass: map, crawl, Wire read/write actions, AI visibility search, and
  browser tasks each get a submit action plus a separate poll action.
- **`auth.validate()` calls a real (paid) endpoint** — `search` with
  `limit: 1`, 3 credits — to verify the key on explicit user connect,
  matching Firecrawl's and Airtable's own validate() pattern (both call a
  real endpoint). This is a deliberate difference from the Botpress
  integration elsewhere in this session, which skips eager validation
  entirely: Botpress's `register()` can fire on more implicit/automatic
  occasions, while Activepieces' `validate()` only runs once, on the user's
  explicit "connect" action — closer to intentional, expected cost.
- **Wire read and write actions are two separate action types**
  (`wire_run_read_action` / `wire_run_write_action`), not one action with a
  type switch, mirroring the split already present in `anakin-mcp`
  (`src/tools/wire.ts`). There it exists so the MCP server can give each tool
  an honest safety annotation (`readOnlyHint` vs `destructiveHint`) for the
  Anthropic Connectors Directory review. Activepieces has no equivalent
  per-action annotation, but the split still gives users a clear, self-
  documenting choice in the flow builder's action picker instead of one
  action whose behavior (safe read vs. state-changing write) depends on
  which `action_id` happens to be passed — cheap to keep, meaningfully
  clearer. Both submit actions share one poll action, `get_wire_job_result`,
  since the poll endpoint (`GET /wire/jobs/:jobId`) and response shape are
  identical either way.
- **No financial-transaction guard ported over.** `anakin-mcp`'s
  `wire_write_action` / `wire_build` / `browser_task` tools refuse anything
  that looks like a payment or fund transfer (`src/tools/policy.ts`) because
  the Anthropic Connectors Directory prohibits an MCP connector from
  executing financial transactions when driven autonomously by an LLM from a
  natural-language prompt. An Activepieces flow is different: a human
  explicitly configures each step and its exact parameters at build time
  (there's no LLM improvising which `action_id` to call from open-ended
  intent), so the prompt-injection threat model that guard exists for isn't
  present here. Not porting it is a deliberate scope call, not an oversight
  — flagging it in case the account owner wants defense-in-depth anyway.
- **`monitor_control`'s four verbs collapse into one action** with a static
  dropdown (`pause` / `resume` / `run_now` / `delete`), matching
  `anakin-mcp`'s `monitor_control` tool shape exactly (same four verbs, same
  id+action inputs) rather than four separate Activepieces actions — the
  verbs share one endpoint family (`/monitors/:id/{pause,resume,run}` +
  `DELETE /monitors/:id`) and one mental model ("control this monitor").
- **`ai_visibility_search`'s `include_full_content` filtering was not
  ported.** The MCP tool strips each engine's large raw answer by default
  and lets the caller opt back in; the Activepieces action just returns
  `response.body` untouched (matching every other action's pattern here,
  scrape/agentic-search included) — trimming large fields is exactly what a
  downstream flow step (e.g. a Code step) is for, and every other action in
  this piece leaves shaping to the flow rather than the piece.
- **Monitor `alertWebhookSecret` is not redacted.** `anakin-mcp`'s
  `monitor.ts` scrubs it before it reaches a model, because MCP tool output
  goes straight into an LLM context window (a chat transcript) where a
  leaked secret is compromised by definition. An Activepieces action's
  output goes into the flow's data pane instead, visible only to users who
  already have access to that flow/connection — a materially different
  exposure surface — so this piece intentionally returns the API response
  unmodified, consistent with every other action here returning
  `response.body` as-is.

## Steps (needs the account owner)

1. `npm publish` under the `@anakin-io` npm org (or drop the scope if
   publishing unscoped) — needs npm credentials.
2. Install into a real Activepieces instance (Settings → My Pieces →
   Install Piece → package name) and test all 28 actions against a live key
   — never done, this was verified by typecheck/build/load only.
3. Optionally file a GitHub Discussion or reach out on their Discord about
   getting it added to the curated pieces list once the outside-PR pause
   lifts.

## Not done

Typechecks, builds, and loads (`require()`) cleanly against the real
published dependencies, but has never run inside an actual Activepieces
flow — needs the account owner to publish and install it for that. All 21
of `anakin-mcp`'s tool concepts (3 already covered by the original 5
actions + all 18 remaining ones) now have an Activepieces action — the one
capability intentionally left out is creating a browser session, which
`anakin-mcp` itself doesn't expose either: it's an interactive noVNC/2FA
flow (the user logs in live) that cannot run as a single non-interactive
piece action or MCP tool call.
