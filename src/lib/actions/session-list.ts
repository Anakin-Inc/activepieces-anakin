import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const sessionList = createAction({
  auth: anakinAuth,
  name: 'session_list',
  displayName: 'List Browser Sessions',
  description:
    'List your saved browser sessions — encrypted login states captured via the Anakin dashboard or Browser API. Each session\'s id is what you pass as Session ID to scrape/crawl, "Create Website Monitor", or "Run AI Browser Task" to work with login-protected pages. Optionally filter by website domain. If no session exists for a site, the user must create one interactively in the dashboard — that flow cannot run from here.',
  props: {
    domain: Property.ShortText({
      displayName: 'Domain',
      description: 'Filter to sessions for one website domain, e.g. "amazon.com".',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const queryParams: Record<string, string> = {};
    if (propsValue.domain) {
      queryParams['domain'] = propsValue.domain;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}/sessions`,
      headers: { 'X-API-Key': auth.secret_text },
      queryParams,
    });

    return response.body;
  },
});
