import { createAction } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const aiVisibilitySources = createAction({
  auth: anakinAuth,
  name: 'ai_visibility_sources',
  displayName: 'List AI Visibility Sources',
  description:
    'List the AI answer engines available to "Start AI Visibility Search" — each with its slug (what you pass as Sources) and display label. Synchronous — returns immediately.',
  props: {},
  async run({ auth }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}/ai-visibility/sources`,
      headers: { 'X-API-Key': auth.secret_text },
    });

    return response.body;
  },
});
