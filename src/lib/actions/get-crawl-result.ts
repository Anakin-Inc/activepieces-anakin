import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const getCrawlResult = createAction({
  auth: anakinAuth,
  name: 'get_crawl_result',
  displayName: 'Get Crawl Result',
  description:
    'Fetch the status and results of a crawl job started by "Crawl Website". Add a Delay step before this if the job may still be running.',
  props: {
    jobId: Property.ShortText({
      displayName: 'Job ID',
      description: 'The jobId returned by "Crawl Website".',
      required: true,
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}/crawl/${propsValue.jobId}`,
      headers: { 'X-API-Key': auth.secret_text },
    });

    return response.body;
  },
});
