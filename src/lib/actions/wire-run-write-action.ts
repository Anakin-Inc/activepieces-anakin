import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const wireRunWriteAction = createAction({
  auth: anakinAuth,
  name: 'wire_run_write_action',
  displayName: 'Run Wire Write Action',
  description:
    'Run a Wire WRITE action — one whose type is "write" (it performs a state-changing interaction on the target site): submit a form, add an item to a cart, post or send content, update account settings. Discover action_ids first with "Discover Wire Actions" or "Browse Wire Catalog" and confirm the action\'s type is "write". Most write actions need auth — pass a Credential ID from "List Wire Identities" or "Wire Login". Returns the completed result directly when the job finishes synchronously; otherwise returns a job_id — use "Get Wire Job Result" (with a Delay in between) to fetch it.',
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
