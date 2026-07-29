import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const monitorChanges = createAction({
  auth: anakinAuth,
  name: 'monitor_changes',
  displayName: 'Get Monitor Changes',
  description:
    'Get the detected changes for a monitor — each entry records when the watched content differed from the previous check, with a diff/summary (and the AI change summary when AI Mode is on). Use "List Website Monitors" first to find the monitor id.',
  props: {
    id: Property.ShortText({
      displayName: 'Monitor ID',
      description: 'The monitor ID (from "List Website Monitors" or "Create Website Monitor").',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}/monitors/${encodeURIComponent(propsValue.id)}/changes`,
      headers: { 'X-API-Key': auth.secret_text },
    });

    return response.body;
  },
});
