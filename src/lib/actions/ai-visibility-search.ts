import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const aiVisibilitySearch = createAction({
  auth: anakinAuth,
  name: 'ai_visibility_search',
  displayName: 'Start AI Visibility Search',
  description:
    'Ask multiple AI answer engines (ChatGPT, Gemini, Google AI Overview) the same question and compare their answers — for brand/AI-SEO visibility checks. Returns a search_id — use "Get AI Visibility Result" (with a Delay in between) to fetch per-engine results, a synthesis, and status once complete. Billed per source; failed sources are free.',
  props: {
    query: Property.LongText({
      displayName: 'Query',
      description: 'The question to ask every engine (max 2000 characters).',
      required: true,
    }),
    sources: Property.Array({
      displayName: 'Sources',
      description: 'Engine slugs to query (see "List AI Visibility Sources"). Omit to query all enabled engines.',
      required: false,
    }),
    country: Property.ShortText({
      displayName: 'Country',
      description: 'Two-letter ISO country for the search geography (proxy exit). Defaults to "us".',
      required: false,
      defaultValue: 'us',
    }),
  },
  async run({ auth, propsValue }) {
    const body: Record<string, unknown> = { query: propsValue.query };
    if (propsValue.sources && propsValue.sources.length > 0) {
      body['sources'] = propsValue.sources;
    }
    if (propsValue.country) {
      body['country'] = propsValue.country;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/ai-visibility/search`,
      headers: { 'X-API-Key': auth.secret_text },
      body,
    });

    return response.body;
  },
});
