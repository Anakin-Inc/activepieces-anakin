import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const crawlWebsite = createAction({
  auth: anakinAuth,
  name: 'crawl_website',
  displayName: 'Crawl Website',
  description:
    'Bulk-fetch markdown across a site — for catalog ingestion or a site-wide RAG corpus. Returns a job ID — use "Get Crawl Result" (with a Delay in between, this can take minutes) to fetch the pages.',
  props: {
    url: Property.ShortText({
      displayName: 'URL',
      description: 'Starting URL.',
      required: true,
    }),
    maxPages: Property.Number({
      displayName: 'Max Pages',
      description: 'Hard cap on pages fetched (1-500).',
      required: false,
      defaultValue: 10,
    }),
    depth: Property.Number({
      displayName: 'Depth',
      description: 'Link-hops from the starting URL to follow (1-5).',
      required: false,
      defaultValue: 1,
    }),
    country: Property.ShortText({
      displayName: 'Country',
      description: 'Two-letter proxy egress country code.',
      required: false,
      defaultValue: 'us',
    }),
    useBrowser: Property.Checkbox({
      displayName: 'Use Browser',
      description: 'Render each page in a headless browser (for SPAs).',
      required: false,
      defaultValue: false,
    }),
    includePatterns: Property.Array({
      displayName: 'Include Patterns',
      description: 'Glob/regex patterns. Only URLs matching at least one pattern are fetched.',
      required: false,
    }),
    excludePatterns: Property.Array({
      displayName: 'Exclude Patterns',
      description: 'Glob/regex patterns. URLs matching any pattern are skipped.',
      required: false,
    }),
    sessionId: Property.ShortText({
      displayName: 'Session ID',
      description: 'Optional saved-browser-session ID for login-protected sites.',
      required: false,
    }),
    sessionName: Property.ShortText({
      displayName: 'Session Name',
      description: 'Optional saved-browser-session name.',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const body: Record<string, unknown> = {
      url: propsValue.url,
      maxPages: propsValue.maxPages,
      depth: propsValue.depth,
      country: propsValue.country,
      useBrowser: propsValue.useBrowser,
    };
    if (propsValue.includePatterns && propsValue.includePatterns.length > 0) {
      body['includePatterns'] = propsValue.includePatterns;
    }
    if (propsValue.excludePatterns && propsValue.excludePatterns.length > 0) {
      body['excludePatterns'] = propsValue.excludePatterns;
    }
    if (propsValue.sessionId) {
      body['sessionId'] = propsValue.sessionId;
    }
    if (propsValue.sessionName) {
      body['sessionName'] = propsValue.sessionName;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/crawl`,
      headers: { 'X-API-Key': auth.secret_text },
      body,
    });

    return response.body;
  },
});
