import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const wireDiscover = createAction({
  auth: anakinAuth,
  name: 'wire_discover',
  displayName: 'Discover Wire Actions',
  description:
    'Find Wire actions for a task from a natural-language intent. Wire is a catalog of pre-built automation actions across hundreds of websites (Amazon, Walmart, LinkedIn, Airbnb, Zillow, and others) — both READ actions (extract data) and WRITE actions (submit a form, log in). Returns ranked candidate actions, each with its action_id, type, required/optional params, credit cost, and whether auth is needed. Run a returned action with "Run Wire Read Action" or "Run Wire Write Action".',
  props: {
    q: Property.ShortText({
      displayName: 'Intent',
      description:
        'The intent in natural language, e.g. "top phones on walmart", "search airbnb listings in Lisbon".',
      required: true,
    }),
    limit: Property.Number({
      displayName: 'Limit',
      description: 'Maximum number of candidate actions to return.',
      required: false,
      defaultValue: 5,
    }),
  },
  async run({ auth, propsValue }) {
    const queryParams: Record<string, string> = { q: propsValue.q };
    if (propsValue.limit !== undefined && propsValue.limit !== null) {
      queryParams['limit'] = String(propsValue.limit);
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}/wire/resolve`,
      headers: { 'X-API-Key': auth.secret_text },
      queryParams,
    });

    return response.body;
  },
});
