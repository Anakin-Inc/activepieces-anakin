import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const getAiVisibilityResult = createAction({
  auth: anakinAuth,
  name: 'get_ai_visibility_result',
  displayName: 'Get AI Visibility Result',
  description:
    'Fetch the status and results of an AI visibility search started by "Start AI Visibility Search". Add a Delay step before this if the search may still be running (typically completes within 1-2 minutes).',
  props: {
    searchId: Property.ShortText({
      displayName: 'Search ID',
      description: 'The search_id returned by "Start AI Visibility Search".',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}/ai-visibility/search/${encodeURIComponent(propsValue.searchId)}`,
      headers: { 'X-API-Key': auth.secret_text },
    });

    return response.body;
  },
});
