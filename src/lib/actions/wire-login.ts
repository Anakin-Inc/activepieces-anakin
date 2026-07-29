import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const wireLogin = createAction({
  auth: anakinAuth,
  name: 'wire_login',
  displayName: 'Wire Login',
  description:
    'Sign in to a credentials-mode Wire site and get a credential_id usable immediately with "Run Wire Read Action" / "Run Wire Write Action". Provide the catalog slug and login params (the fields that catalog\'s login schema defines, e.g. email/password — see "Browse Wire Catalog"\'s login_input_schema). The password is never stored, only the encrypted session. Synchronous — returns immediately.',
  props: {
    catalogSlug: Property.ShortText({
      displayName: 'Catalog Slug',
      description: 'The catalog to sign in to (e.g. "neb").',
      required: true,
    }),
    params: Property.Json({
      displayName: 'Login Params',
      description:
        "Login fields defined by the catalog (e.g. { email, password }). Use \"Browse Wire Catalog\"'s login_input_schema to learn the field names.",
      required: false,
    }),
    identityName: Property.ShortText({
      displayName: 'Identity Name',
      description:
        'Optional name for the identity. Derived from params in password mode; required when using a 1Password locator.',
      required: false,
    }),
    sourceId: Property.ShortText({
      displayName: 'Source ID',
      description: 'Optional 1Password identity-source ID (alternative to Login Params).',
      required: false,
    }),
    sourceRef: Property.Json({
      displayName: 'Source Ref',
      description:
        'Optional 1Password item locator { vault_id, item_id, fields } (use with Source ID instead of Login Params).',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const body: Record<string, unknown> = { catalog_slug: propsValue.catalogSlug };
    if (propsValue.params && Object.keys(propsValue.params).length > 0) {
      body['params'] = propsValue.params;
    }
    if (propsValue.identityName) {
      body['identity_name'] = propsValue.identityName;
    }
    if (propsValue.sourceId) {
      body['source_id'] = propsValue.sourceId;
    }
    if (propsValue.sourceRef && Object.keys(propsValue.sourceRef).length > 0) {
      body['source_ref'] = propsValue.sourceRef;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/wire/login`,
      headers: { 'X-API-Key': auth.secret_text },
      body,
    });

    return response.body;
  },
});
