import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const sessionDelete = createAction({
  auth: anakinAuth,
  name: 'session_delete',
  displayName: 'Delete Browser Session',
  description:
    'Permanently delete a saved browser session and its encrypted login data. Irreversible — the user must log in again through the dashboard to recreate it, and any monitors or requests referencing this Session ID will lose authenticated access. Find ids with "List Browser Sessions".',
  props: {
    id: Property.ShortText({
      displayName: 'Session ID',
      description: 'The session ID to delete (from "List Browser Sessions").',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.DELETE,
      url: `${ANAKIN_API_BASE_URL}/sessions/${encodeURIComponent(propsValue.id)}`,
      headers: { 'X-API-Key': auth.secret_text },
    });

    return response.body;
  },
});
