import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const wireIdentities = createAction({
  auth: anakinAuth,
  name: 'wire_identities',
  displayName: 'List Wire Identities',
  description:
    'List your saved Wire identities and their credentials. An identity is a named account on a site; each credential\'s id is the Credential ID you pass to "Run Wire Read Action" / "Run Wire Write Action" to run actions whose auth_mode is "required". Optionally filter by catalog_id.',
  props: {
    catalogId: Property.ShortText({
      displayName: 'Catalog ID',
      description: 'Optional — restrict to identities for a single catalog.',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const queryParams: Record<string, string> = {};
    if (propsValue.catalogId) {
      queryParams['catalog_id'] = propsValue.catalogId;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${ANAKIN_API_BASE_URL}/wire/identities`,
      headers: { 'X-API-Key': auth.secret_text },
      queryParams,
    });

    return response.body;
  },
});
