import { createPiece } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { anakinAuth } from './lib/auth';
import { scrapeUrl } from './lib/actions/scrape-url';
import { getScrapeResult } from './lib/actions/get-scrape-result';
import { search } from './lib/actions/search';
import { agenticSearch } from './lib/actions/agentic-search';
import { getAgenticSearchResult } from './lib/actions/get-agentic-search-result';

export const anakin = createPiece({
  displayName: 'Anakin',
  description:
    'Web scraping, AI search, and multi-stage agentic research — turn any website into clean markdown or structured JSON.',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://anakin.io/logo-square.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['anakin-io'],
  auth: anakinAuth,
  actions: [scrapeUrl, getScrapeResult, search, agenticSearch, getAgenticSearchResult],
  triggers: [],
});
