import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const wireCatalog = createAction({
  auth: anakinAuth,
  name: 'wire_catalog',
  displayName: 'Browse Wire Catalog',
  description:
    'Browse the Wire catalog. With no slug, lists every supported website and its action count. Pass a catalog slug (e.g. "walmart", "amazon", "linkedin") to get that site\'s full action list with exact parameter schemas, each action\'s type (read/write), auth mode, and credit cost.',
  props: {
    slug: Property.ShortText({
      displayName: 'Catalog Slug',
      description: 'Catalog slug to inspect (e.g. "walmart"). Omit to list all catalogs.',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const path = propsValue.slug
      ? `/wire/catalog/${encodeURIComponent(propsValue.slug)}`
      : '/wire/catalog';

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}${path}`,
      headers: { 'X-API-Key': auth.secret_text },
    });

    return response.body;
  },
});
