import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const scrapeUrl = createAction({
  auth: anakinAuth,
  name: 'scrape_url',
  displayName: 'Extract Website Data',
  description:
    'Submit a URL to scrape. Returns a job ID — use "Get Scrape Result" (with a Delay in between) to fetch the completed markdown/JSON.',
  props: {
    url: Property.ShortText({
      displayName: 'URL',
      description: 'The full URL of the website to extract data from.',
      required: true,
    }),
    generateJson: Property.Checkbox({
      displayName: 'Generate JSON',
      description: 'AI-extract structured JSON from the page content.',
      required: false,
      defaultValue: false,
    }),
    country: Property.ShortText({
      displayName: 'Country',
      description: 'Proxy country code, e.g. us, gb, de.',
      required: false,
      defaultValue: 'us',
    }),
    useBrowser: Property.Checkbox({
      displayName: 'Use Browser',
      description: 'Use a headless browser — best for JS-heavy sites.',
      required: false,
      defaultValue: false,
    }),
    forceFresh: Property.Checkbox({
      displayName: 'Force Fresh',
      description: 'Bypass the cache and force a fresh extraction.',
      required: false,
      defaultValue: false,
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/url-scraper`,
      headers: { 'X-API-Key': auth.secret_text },
      body: {
        url: propsValue.url,
        generateJson: propsValue.generateJson,
        country: propsValue.country,
        useBrowser: propsValue.useBrowser,
        forceFresh: propsValue.forceFresh,
      },
    });

    return response.body;
  },
});
