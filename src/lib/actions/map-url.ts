import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const mapUrl = createAction({
  auth: anakinAuth,
  name: 'map_url',
  displayName: 'Map Website URLs',
  description:
    'Discover all reachable URLs under a site — useful for understanding a domain\'s structure before crawling. Returns a job ID — use "Get Map Result" (with a Delay in between) to fetch the link list.',
  props: {
    url: Property.ShortText({
      displayName: 'URL',
      description: 'The starting URL for discovery (typically a homepage or section root).',
      required: true,
    }),
    limit: Property.Number({
      displayName: 'Limit',
      description: 'Maximum number of URLs to return overall (1-1000).',
      required: false,
      defaultValue: 100,
    }),
    depth: Property.Number({
      displayName: 'Depth',
      description: 'How many link-hops from the starting URL to follow (1-5).',
      required: false,
      defaultValue: 2,
    }),
    limitPerLevel: Property.Number({
      displayName: 'Limit Per Level',
      description: 'Maximum URLs collected per depth level (controls breadth).',
      required: false,
      defaultValue: 100,
    }),
    includeSubdomains: Property.Checkbox({
      displayName: 'Include Subdomains',
      description: 'Include URLs on subdomains of the starting host.',
      required: false,
      defaultValue: false,
    }),
    includeExternalLinks: Property.Checkbox({
      displayName: 'Include External Links',
      description: 'Also collect (but do not follow) external links.',
      required: false,
      defaultValue: false,
    }),
    useBrowser: Property.Checkbox({
      displayName: 'Use Browser',
      description: 'Render with a headless browser (for SPAs).',
      required: false,
      defaultValue: false,
    }),
    search: Property.ShortText({
      displayName: 'Search Filter',
      description: 'Optional keyword filter — only return URLs whose path/title matches.',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const body: Record<string, unknown> = {
      url: propsValue.url,
      limit: propsValue.limit,
      depth: propsValue.depth,
      limitPerLevel: propsValue.limitPerLevel,
      includeSubdomains: propsValue.includeSubdomains,
      includeExternalLinks: propsValue.includeExternalLinks,
      useBrowser: propsValue.useBrowser,
    };
    if (propsValue.search) {
      body['search'] = propsValue.search;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/map`,
      headers: { 'X-API-Key': auth.secret_text },
      body,
    });

    return response.body;
  },
});
