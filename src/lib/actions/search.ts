import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const search = createAction({
  auth: anakinAuth,
  name: 'search',
  displayName: 'Perform AI Search',
  description:
    'AI-powered web search with citations. Synchronous — returns immediately, no polling needed.',
  props: {
    prompt: Property.LongText({
      displayName: 'Search Query',
      description: 'The search query or question.',
      required: true,
    }),
    limit: Property.Number({
      displayName: 'Max Results',
      description: 'Maximum number of results to return (default 5, max 20).',
      required: false,
      defaultValue: 5,
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/search`,
      headers: { 'X-API-Key': auth.secret_text },
      body: { prompt: propsValue.prompt, limit: propsValue.limit },
    });

    return response.body;
  },
});
