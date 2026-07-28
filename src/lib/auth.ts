import { PieceAuth } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { ANAKIN_API_BASE_URL } from './common';

const markdownDescription = `
Get a free API key at [anakin.io/dashboard](https://anakin.io/dashboard) —
500 credits, no card required.
`;

export const anakinAuth = PieceAuth.SecretText({
  description: markdownDescription,
  displayName: 'API Key',
  required: true,
  validate: async ({ auth }) => {
    try {
      // No free/no-credit endpoint exists to validate against without
      // spending credits (search costs 3, scrape/agentic-search cost
      // more) — same reasoning as the Botpress integration's register()
      // in this same codebase. A cheap, real call: search with limit 1.
      await httpClient.sendRequest({
        method: HttpMethod.POST,
        url: `${ANAKIN_API_BASE_URL}/search`,
        headers: { 'X-API-Key': auth as string },
        body: { prompt: 'anakin api key validation', limit: 1 },
      });
      return { valid: true };
    } catch (e) {
      return { valid: false, error: 'Invalid API key' };
    }
  },
});
