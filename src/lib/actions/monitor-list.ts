import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const monitorList = createAction({
  auth: anakinAuth,
  name: 'monitor_list',
  displayName: 'List Website Monitors',
  description:
    'List your website monitors, or pass an ID to fetch one monitor\'s full configuration and status (next/last check time, active state, per-check credit cost, alert settings). Use this to find a monitor\'s id before "Get Monitor Changes" or "Control Website Monitor".',
  props: {
    id: Property.ShortText({
      displayName: 'Monitor ID',
      description: 'Fetch just this monitor instead of the full list.',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const path = propsValue.id
      ? `/monitors/${encodeURIComponent(propsValue.id)}`
      : '/monitors';

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}${path}`,
      headers: { 'X-API-Key': auth.secret_text },
    });

    return response.body;
  },
});
