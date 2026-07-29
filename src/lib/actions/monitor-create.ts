import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { anakinAuth } from '../auth';
import { ANAKIN_API_BASE_URL } from '../common';

export const monitorCreate = createAction({
  auth: anakinAuth,
  name: 'monitor_create',
  displayName: 'Create Website Monitor',
  description:
    'Create a scheduled website monitor that checks a URL every Interval Minutes (min 15) and records a change when the content differs — optionally alerting a webhook or email. Scope "page" (default) watches one URL; "site" crawls the site each run; "wire" runs a Wire action each check and diffs its JSON. Watch Mode "full_page" compares the whole page; "specific_data" extracts only the fields in Output Schema with AI. Active-monitor caps per plan: Free 5, Pro 20, Scale 100.',
  props: {
    url: Property.ShortText({
      displayName: 'URL',
      description:
        'The URL to watch (root URL for site scope; the Wire site\'s URL for wire scope).',
      required: true,
    }),
    intervalMinutes: Property.Number({
      displayName: 'Interval Minutes',
      description: 'Check frequency in minutes. Minimum 15.',
      required: true,
    }),
    scope: Property.StaticDropdown({
      displayName: 'Scope',
      description: 'What to monitor: one page (default), a whole site, or a Wire action.',
      required: false,
      defaultValue: 'page',
      options: {
        options: [
          { label: 'Page', value: 'page' },
          { label: 'Site', value: 'site' },
          { label: 'Wire', value: 'wire' },
        ],
      },
    }),
    watchMode: Property.StaticDropdown({
      displayName: 'Watch Mode',
      description:
        'Compare the whole page (default) or only the fields in Output Schema, extracted with AI.',
      required: false,
      defaultValue: 'full_page',
      options: {
        options: [
          { label: 'Full Page', value: 'full_page' },
          { label: 'Specific Data', value: 'specific_data' },
        ],
      },
    }),
    watchFormat: Property.StaticDropdown({
      displayName: 'Watch Format',
      description: 'Format compared in full_page mode. Defaults to markdown.',
      required: false,
      defaultValue: 'markdown',
      options: {
        options: [
          { label: 'Markdown', value: 'markdown' },
          { label: 'HTML', value: 'html' },
          { label: 'Cleaned HTML', value: 'cleaned_html' },
        ],
      },
    }),
    outputSchema: Property.Json({
      displayName: 'Output Schema',
      description: 'JSON Schema of the fields to track. Required when Watch Mode is "specific_data".',
      required: false,
    }),
    aiMode: Property.Checkbox({
      displayName: 'AI Mode',
      description:
        'AI meaningful-change filtering: ignores trivial noise (ads, timestamps) and summarizes real changes. +1 credit per check.',
      required: false,
      defaultValue: false,
    }),
    aiGoal: Property.LongText({
      displayName: 'AI Goal',
      description:
        'Natural-language description of which changes count as meaningful (used with AI Mode), e.g. "only when the price drops or it goes out of stock".',
      required: false,
    }),
    useBrowser: Property.Checkbox({
      displayName: 'Use Browser',
      description:
        'Render checks with a stealth headless browser (needed for JS-heavy pages). Forced true when Session ID is set.',
      required: false,
      defaultValue: false,
    }),
    country: Property.ShortText({
      displayName: 'Country',
      description: 'Two-letter proxy country code. Defaults to "us".',
      required: false,
      defaultValue: 'us',
    }),
    sessionId: Property.ShortText({
      displayName: 'Session ID',
      description: 'Saved browser-session ID for monitoring login-protected pages (see "List Browser Sessions").',
      required: false,
    }),
    isActive: Property.Checkbox({
      displayName: 'Active',
      description: 'Start running immediately. Defaults to true.',
      required: false,
      defaultValue: true,
    }),
    expiresAt: Property.ShortText({
      displayName: 'Expires At',
      description:
        'Optional end date (ISO 8601 timestamp or YYYY-MM-DD); the monitor auto-pauses when it passes.',
      required: false,
    }),
    alertWebhookUrl: Property.ShortText({
      displayName: 'Alert Webhook URL',
      description: 'Webhook URL that receives signed change alerts.',
      required: false,
    }),
    alertEmails: Property.ShortText({
      displayName: 'Alert Emails',
      description: 'Comma-separated email recipients for change alerts.',
      required: false,
    }),
    maxPages: Property.Number({
      displayName: 'Max Pages',
      description: 'Site scope: max pages crawled per run.',
      required: false,
    }),
    maxDepth: Property.Number({
      displayName: 'Max Depth',
      description: 'Site scope: crawl depth (1-5). Defaults to 2.',
      required: false,
    }),
    includePatterns: Property.Array({
      displayName: 'Include Patterns',
      description: 'Site scope: glob patterns or hand-picked same-site URLs to track.',
      required: false,
    }),
    excludePatterns: Property.Array({
      displayName: 'Exclude Patterns',
      description: 'Site scope: glob patterns to skip.',
      required: false,
    }),
    wireActionId: Property.ShortText({
      displayName: 'Wire Action ID',
      description:
        'Wire scope (required there): the Wire action run each check, e.g. "amazon.search_products" (see "Discover Wire Actions").',
      required: false,
    }),
    wireCatalogSlug: Property.ShortText({
      displayName: 'Wire Catalog Slug',
      description: 'Wire scope: catalogue slug of the Wire site.',
      required: false,
    }),
    wireCredentialId: Property.ShortText({
      displayName: 'Wire Credential ID',
      description: 'Wire scope: credential ID when the action needs auth (see "List Wire Identities").',
      required: false,
    }),
    wireParams: Property.Json({
      displayName: 'Wire Params',
      description: 'Wire scope: parameters passed to the action each check.',
      required: false,
    }),
    wireWatchPaths: Property.Array({
      displayName: 'Wire Watch Paths',
      description: 'Wire scope: JSON paths to diff instead of the whole response.',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const body: Record<string, unknown> = {
      url: propsValue.url,
      intervalMinutes: propsValue.intervalMinutes,
    };
    const passthrough = [
      'scope',
      'watchMode',
      'watchFormat',
      'outputSchema',
      'aiMode',
      'aiGoal',
      'useBrowser',
      'country',
      'sessionId',
      'isActive',
      'expiresAt',
      'alertWebhookUrl',
      'alertEmails',
      'maxPages',
      'maxDepth',
      'includePatterns',
      'excludePatterns',
      'wireActionId',
      'wireCatalogSlug',
      'wireCredentialId',
      'wireParams',
      'wireWatchPaths',
    ] as const;
    for (const key of passthrough) {
      const value = (propsValue as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && value !== '') {
        body[key] = value;
      }
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${ANAKIN_API_BASE_URL}/monitors`,
      headers: { 'X-API-Key': auth.secret_text },
      body,
    });

    return response.body;
  },
});
