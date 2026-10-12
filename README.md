# Anakin piece for Activepieces

Scrape and crawl websites, search the web with AI, run deep research, use
pre-built Wire actions on hundreds of sites, monitor pages for changes, compare
AI answer engines and drive an AI cloud browser, from your
[Activepieces](https://www.activepieces.com) flows. Powered by
[Anakin](https://anakin.io).

## Install

On a self-hosted Activepieces instance:

1. Go to **Settings → My Pieces → Install Piece**
2. Enter the package name `@anakin-io/piece-anakin` and install
3. Add the **Anakin** step to a flow and connect it with your API key, free at
   [anakin.io/dashboard](https://anakin.io/dashboard)

Requires Activepieces 0.82 or later.

## Actions

Long-running jobs come as two actions, following Activepieces' convention: one
starts the job and returns its ID, and a "Get … Result" action fetches the
result. Put a **Delay** step between them.

| Group | Action | What it does |
|---|---|---|
| Web | Extract Website Data / Get Scrape Result | One page as HTML, markdown and optional AI-extracted JSON |
| | Perform AI Search | Web search with URLs, titles and snippets, returned immediately |
| | Start Agentic Search / Get Agentic Search Result | Deep research across many sources |
| | Map Website URLs / Get Map Result | Every URL on a site |
| | Crawl Website / Get Crawl Result | Many pages of one site as markdown |
| Wire | Discover Wire Actions | Find pre-built actions for a task |
| | Browse Wire Catalog | Every supported site, or one site's actions and parameters |
| | Run Wire Read Action / Run Wire Write Action | Run an action that reads data, or one that changes something |
| | Get Wire Job Result | Result of a Wire action that ran as a job |
| | List Wire Identities | Saved site logins and their credential IDs |
| | Wire Login | Sign in to a site and get a credential ID |
| | Request New Wire Action | Ask Wire to build actions for a new site |
| Monitors | Create Website Monitor | Watch a page, site or Wire action on a schedule |
| | List Website Monitors | Your monitors, or one monitor's settings |
| | Get Monitor Changes | Changes a monitor detected |
| | Control Website Monitor | Pause, resume, run now or delete a monitor |
| AI Visibility | Start AI Visibility Search / Get AI Visibility Result | Ask ChatGPT, Gemini and Google AI Overview the same question |
| | List AI Visibility Sources | The answer engines available |
| Browser | List Browser Sessions | Saved browser sessions, for pages behind a login |
| | Delete Browser Session | Delete a saved browser session |
| | Run AI Browser Task / Get Browser Task Result | An AI agent that drives a real browser through a multi-step task |

## Development

```bash
npm ci
npm run build
npm run check:load   # the built piece loads and registers its actions
```

Releases publish to npm from GitHub Actions, with a provenance statement, when a
`v*` tag matching the version in `package.json` is pushed.

## License

MIT
