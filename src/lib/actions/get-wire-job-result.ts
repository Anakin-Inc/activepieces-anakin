import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const getWireJobResult = createAction({
  auth: anakinAuth,
  name: 'get_wire_job_result',
  displayName: 'Get Wire Job Result',
  description:
    'Fetch the status and result of a Wire job started by "Run Wire Read Action" or "Run Wire Write Action" (only needed when that action returned a job_id instead of an inline result). Add a Delay step before this if the job may still be processing.',
  props: {
    jobId: Property.ShortText({
      displayName: 'Job ID',
      description: 'The job_id returned by "Run Wire Read Action" / "Run Wire Write Action".',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}/wire/jobs/${propsValue.jobId}`,
      headers: { 'X-API-Key': auth.secret_text },
    });

    return response.body;
  },
});
