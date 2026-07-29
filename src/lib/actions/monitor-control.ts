import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const monitorControl = createAction({
  auth: anakinAuth,
  name: 'monitor_control',
  displayName: 'Control Website Monitor',
  description:
    'Control an existing website monitor: "pause" stops scheduled checks, "resume" restarts them (may hit the plan\'s active-monitor cap), "run_now" triggers an immediate out-of-schedule check (billed like a normal check), and "delete" permanently removes the monitor and its history. Use "List Website Monitors" to find the id.',
  props: {
    id: Property.ShortText({
      displayName: 'Monitor ID',
      description: 'The monitor ID (from "List Website Monitors" or "Create Website Monitor").',
      required: true,
    }),
    action: Property.StaticDropdown({
      displayName: 'Action',
      description: 'What to do with the monitor.',
      required: true,
      options: {
        options: [
          { label: 'Pause', value: 'pause' },
          { label: 'Resume', value: 'resume' },
          { label: 'Run Now', value: 'run_now' },
          { label: 'Delete', value: 'delete' },
        ],
      },
    }),
  },
  async run({ auth, propsValue }) {
    const id = encodeURIComponent(propsValue.id);
    const headers = { 'X-API-Key': auth.secret_text };

    switch (propsValue.action) {
      case 'pause': {
        const response = await httpClient.sendRequest({
          method: HttpMethod.POST,
          url: `${ANAKIN_API_BASE_URL}/monitors/${id}/pause`,
          headers,
        });
        return response.body;
      }
      case 'resume': {
        const response = await httpClient.sendRequest({
          method: HttpMethod.POST,
          url: `${ANAKIN_API_BASE_URL}/monitors/${id}/resume`,
          headers,
        });
        return response.body;
      }
      case 'run_now': {
        const response = await httpClient.sendRequest({
          method: HttpMethod.POST,
          url: `${ANAKIN_API_BASE_URL}/monitors/${id}/run`,
          headers,
        });
        return response.body;
      }
      case 'delete': {
        const response = await httpClient.sendRequest({
          method: HttpMethod.DELETE,
          url: `${ANAKIN_API_BASE_URL}/monitors/${id}`,
          headers,
        });
        return response.body;
      }
      default:
        throw new Error(`Unknown monitor action "${propsValue.action}" — use pause, resume, run_now, or delete.`);
    }
  },
});
