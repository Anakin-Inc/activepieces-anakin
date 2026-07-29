import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const getBrowserTaskResult = createAction({
  auth: anakinAuth,
  name: 'get_browser_task_result',
  displayName: 'Get Browser Task Result',
  description:
    'Fetch the status and result of an AI browser task started by "Run AI Browser Task". Add a Delay step before this if the task may still be running (server hard-caps a run at ~5.5 minutes).',
  props: {
    jobId: Property.ShortText({
      displayName: 'Job ID',
      description: 'The workflow_id returned by "Run AI Browser Task".',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}/ai/jobs/${encodeURIComponent(propsValue.jobId)}`,
      headers: { 'X-API-Key': auth.secret_text },
    });

    return response.body;
  },
});
