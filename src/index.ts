import { createPiece } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { anakinAuth } from './lib/auth';
import { scrapeUrl } from './lib/actions/scrape-url';
import { getScrapeResult } from './lib/actions/get-scrape-result';
import { search } from './lib/actions/search';
import { agenticSearch } from './lib/actions/agentic-search';
import { getAgenticSearchResult } from './lib/actions/get-agentic-search-result';
import { mapUrl } from './lib/actions/map-url';
import { getMapResult } from './lib/actions/get-map-result';
import { crawlWebsite } from './lib/actions/crawl-website';
import { getCrawlResult } from './lib/actions/get-crawl-result';
import { wireDiscover } from './lib/actions/wire-discover';
import { wireCatalog } from './lib/actions/wire-catalog';
import { wireRunReadAction } from './lib/actions/wire-run-read-action';
import { wireRunWriteAction } from './lib/actions/wire-run-write-action';
import { getWireJobResult } from './lib/actions/get-wire-job-result';
import { wireIdentities } from './lib/actions/wire-identities';
import { wireLogin } from './lib/actions/wire-login';
import { wireBuild } from './lib/actions/wire-build';
import { monitorCreate } from './lib/actions/monitor-create';
import { monitorList } from './lib/actions/monitor-list';
import { monitorChanges } from './lib/actions/monitor-changes';
import { monitorControl } from './lib/actions/monitor-control';
import { aiVisibilitySearch } from './lib/actions/ai-visibility-search';
import { getAiVisibilityResult } from './lib/actions/get-ai-visibility-result';
import { aiVisibilitySources } from './lib/actions/ai-visibility-sources';
import { sessionList } from './lib/actions/session-list';
import { sessionDelete } from './lib/actions/session-delete';
import { browserTask } from './lib/actions/browser-task';
import { getBrowserTaskResult } from './lib/actions/get-browser-task-result';

export const anakin = createPiece({
  displayName: 'Anakin',
  description:
    'Web scraping, AI search, agentic research, site mapping/crawling, Wire site automation, website monitoring, AI visibility tracking, and AI browser automation — turn any website into clean markdown, structured JSON, or an automatable action.',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://anakin.io/favicon.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['anakin-io'],
  auth: anakinAuth,
  actions: [
    scrapeUrl,
    getScrapeResult,
    search,
    agenticSearch,
    getAgenticSearchResult,
    mapUrl,
    getMapResult,
    crawlWebsite,
    getCrawlResult,
    wireDiscover,
    wireCatalog,
    wireRunReadAction,
    wireRunWriteAction,
    getWireJobResult,
    wireIdentities,
    wireLogin,
    wireBuild,
    monitorCreate,
    monitorList,
    monitorChanges,
    monitorControl,
    aiVisibilitySearch,
    getAiVisibilityResult,
    aiVisibilitySources,
    sessionList,
    sessionDelete,
    browserTask,
    getBrowserTaskResult,
  ],
  triggers: [],
});
