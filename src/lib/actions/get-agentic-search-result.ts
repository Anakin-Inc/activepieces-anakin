import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const getAgenticSearchResult = createAction({
  auth: anakinAuth,
  name: 'get_agentic_search_result',
  displayName: 'Get Agentic Search Result',
  description:
    'Fetch the status and results of an agentic search job started by "Start Agentic Search".',
  props: {
    jobId: Property.ShortText({
      displayName: 'Job ID',
      description: 'The job_id returned by "Start Agentic Search".',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}/agentic-search/${propsValue.jobId}`,
      headers: { 'X-API-Key': auth.secret_text },
    });

    return response.body;
  },
});
