import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const wireBuild = createAction({
  auth: anakinAuth,
  name: 'wire_build',
  displayName: 'Request New Wire Action',
  description:
    "Request a brand-new Wire action for a website that isn't in the catalog yet. Describe the site (website_url) and what the action should do or extract (goal); Wire generates and auto-tests a scraper, then publishes it. Asynchronous (returns status \"pending\") and charges credits, refunded automatically if the build fails. Only use this after \"Discover Wire Actions\" / \"Browse Wire Catalog\" confirm no existing action covers the site.",
  props: {
    websiteUrl: Property.ShortText({
      displayName: 'Website URL',
      description: 'The site to build an action for. The domain is extracted automatically.',
      required: true,
    }),
    goal: Property.LongText({
      displayName: 'Goal',
      description:
        'Natural-language description of what the action should do or extract. Be specific — the builder synthesizes the scraper from this.',
      required: true,
    }),
    catalogId: Property.ShortText({
      displayName: 'Catalog ID',
      description: 'Optional — attach to an existing catalog instead of creating one.',
      required: false,
    }),
    visibility: Property.StaticDropdown({
      displayName: 'Visibility',
      description: 'Action visibility. Defaults to private.',
      required: false,
      defaultValue: 'private',
      options: {
        options: [
          { label: 'Private', value: 'private' },
          { label: 'Public', value: 'public' },
        ],
      },
    }),
    force: Property.Checkbox({
      displayName: 'Force',
      description:
        'Build even if similar actions already exist for the domain (otherwise the request is rejected with ACTION_EXISTS).',
      required: false,
      defaultValue: false,
    }),
  },
  async run({ auth, propsValue }) {
    const body: Record<string, unknown> = {
      website_url: propsValue.websiteUrl,
      goal: propsValue.goal,
    };
    if (propsValue.catalogId) {
      body['catalog_id'] = propsValue.catalogId;
    }
    if (propsValue.visibility) {
      body['visibility'] = propsValue.visibility;
    }
    if (propsValue.force !== undefined) {
      body['force'] = propsValue.force;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/wire/build-request`,
      headers: { 'X-API-Key': auth.secret_text },
      body,
    });

    return response.body;
  },
});
