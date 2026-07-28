import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const agenticSearch = createAction({
  auth: anakinAuth,
  name: 'agentic_search',
  displayName: 'Start Agentic Search',
  description:
    'Start a multi-stage AI research pipeline: search, scrape citations, extract structured data. Returns a job ID — use "Get Agentic Search Result" (with a Delay in between, this can take minutes) to fetch the report.',
  props: {
    prompt: Property.LongText({
      displayName: 'Research Prompt',
      description: 'The research question or topic (max 8KB).',
      required: true,
    }),
    useBrowser: Property.Checkbox({
      displayName: 'Use Browser',
      description: 'Use a headless browser for citation scraping — matches the API default.',
      required: false,
      defaultValue: true,
    }),
    schema: Property.Json({
      displayName: 'Result Schema',
      description: 'Optional JSON Schema (max 50KB) for the structured output.',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const body: Record<string, unknown> = {
      prompt: propsValue.prompt,
      useBrowser: propsValue.useBrowser,
    };
    if (propsValue.schema) {
      body['schema'] = propsValue.schema;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/agentic-search`,
      headers: { 'X-API-Key': auth.secret_text },
      body,
    });

    return response.body;
  },
});
