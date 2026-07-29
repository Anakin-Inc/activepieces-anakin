import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const browserTask = createAction({
  auth: anakinAuth,
  name: 'browser_task',
  displayName: 'Run AI Browser Task',
  description:
    'Run a natural-language task in a real cloud browser driven by an AI agent: it navigates, clicks, types, scrolls, and extracts on your behalf ("find the cheapest 65-inch TV on this site and list its specs", "fill the contact form with ..."). Use when scraping cannot do the job (multi-step flows, interactions, complex navigation). For login-protected tasks pass Session ID from "List Browser Sessions" — never put passwords in the prompt. Submits asynchronously and returns a workflow_id — use "Get Browser Task Result" (with a Delay in between, this can take minutes) to fetch the outcome.',
  props: {
    prompt: Property.LongText({
      displayName: 'Prompt',
      description:
        'The task in natural language. Be specific about the goal and what to return. Never include passwords or secrets — use Session ID for authenticated sites.',
      required: true,
    }),
    url: Property.ShortText({
      displayName: 'URL',
      description: 'Navigate here before starting. Omit to let the agent follow URLs named in the prompt.',
      required: false,
    }),
    sessionId: Property.ShortText({
      displayName: 'Session ID',
      description: 'Saved browser-session ID (from "List Browser Sessions") so the task runs logged in.',
      required: false,
    }),
    maxSteps: Property.Number({
      displayName: 'Max Steps',
      description: 'Cap on agent steps (navigation/click/type actions).',
      required: false,
    }),
    timeoutMs: Property.Number({
      displayName: 'Timeout (ms)',
      description: 'Task timeout in milliseconds (server caps runs at ~330s regardless).',
      required: false,
    }),
    outputSchema: Property.Json({
      displayName: 'Output Schema',
      description: 'JSON Schema for the result — the agent returns structured data conforming to it.',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const body: Record<string, unknown> = {
      prompt: propsValue.prompt,
      async: true,
    };
    if (propsValue.url) {
      body['url'] = propsValue.url;
    }
    if (propsValue.sessionId) {
      body['session_id'] = propsValue.sessionId;
    }
    if (propsValue.maxSteps !== undefined && propsValue.maxSteps !== null) {
      body['max_steps'] = propsValue.maxSteps;
    }
    if (propsValue.timeoutMs !== undefined && propsValue.timeoutMs !== null) {
      body['timeout_ms'] = propsValue.timeoutMs;
    }
    if (propsValue.outputSchema && Object.keys(propsValue.outputSchema).length > 0) {
      body['output_schema'] = propsValue.outputSchema;
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/ai/evaluate`,
      headers: { 'X-API-Key': auth.secret_text },
      body,
    });

    return response.body;
  },
});
