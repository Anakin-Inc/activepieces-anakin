import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const wireRunReadAction = createAction({
  auth: anakinAuth,
  name: 'wire_run_read_action',
  displayName: 'Run Wire Read Action',
  description:
    'Run a Wire READ action — one whose type is "read" (it extracts data and does not change state on the target site): search listings, fetch a category\'s products, get a product\'s price/specs/reviews, read a profile. Discover action_ids first with "Discover Wire Actions" or "Browse Wire Catalog" and confirm the action\'s type is "read". Returns the completed result directly when the job finishes synchronously; otherwise returns a job_id — use "Get Wire Job Result" (with a Delay in between) to fetch it.',
  props: {
    actionId: Property.ShortText({
      displayName: 'Action ID',
      description: 'The action to run (from "Discover Wire Actions" or "Browse Wire Catalog").',
      required: true,
    }),
    params: Property.Json({
      displayName: 'Params',
      description:
        "The action's input parameters. Shape depends on the action — use its parameter schema from discovery. Omit for actions that take none.",
      required: false,
    }),
    credentialId: Property.ShortText({
      displayName: 'Credential ID',
      description:
        'Required when the action\'s auth_mode is "required"; honored when "optional". Get one from "List Wire Identities" or "Wire Login".',
      required: false,
    }),
    identityId: Property.ShortText({
      displayName: 'Identity ID',
      description:
        'Optional identity selector — the server resolves a credential from it (alternative to Credential ID).',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const body: Record<string, unknown> = { action_id: propsValue.actionId };
    if (propsValue.params && Object.keys(propsValue.params).length > 0) {
      body['params'] = propsValue.params;
    }
    if (propsValue.credentialId) {
      body['credential_id'] = propsValue.credentialId;
    }
    if (propsValue.identityId) {
      body['identity_id'] = propsValue.identityId;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/wire/task`,
      headers: { 'X-API-Key': auth.secret_text },
      body,
    });

    return response.body;
  },
});
