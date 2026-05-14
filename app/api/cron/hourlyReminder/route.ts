import { NextResponse } from 'next/server';

/**
 * Hourly push reminder via OneSignal REST API.
 * @see https://documentation.onesignal.com/reference/push-notification
 *
 * Env:
 * - ONESIGNAL_APP_ID
 * - ONESIGNAL_REST_API_KEY (server only)
 * - CRON_SECRET — required in production; send header Authorization: Bearer <CRON_SECRET>
 *
 * POST /api/cron/hourlyReminder
 * Optional JSON body: { "heading"?, "body"?, "includedSegments"? string[] }
 */

const ONE_SIGNAL_PUSH_URL =
  'https://api.onesignal.com/notifications?c=push';

function authorize(request: Request): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  console.log('[hourlyReminder] - Endpoint starting')
  if ( process.env.NODE_ENV === 'production' && !process.env.CRON_SECRET ) {
    return NextResponse.json(
      { error: 'CRON_SECRET is not configured' },
      { status: 503 },
    );
  }

  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const appId = process.env.ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!appId || !apiKey) {
    return NextResponse.json(
      {
        ok: false as const,
        error:
          'Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY in server environment.',
      },
      { status: 503 },
    );
  }

  console.log('[hourlyReminder] - Setting heading and body')
  let heading = 'WydLogs';
  let body =
    'Time for your hourly check-in — what are you working on?';
  let included_segments: string[] = ['Total Subscriptions'];

  try {
    const json = (await request.json()) as {
      heading?: string;
      body?: string;
      includedSegments?: string[];
    };
    if (typeof json.heading === 'string' && json.heading.trim()) {
      heading = json.heading.trim();
    }
    if (typeof json.body === 'string' && json.body.trim()) {
      body = json.body.trim();
    }
    if (
      Array.isArray(json.includedSegments) &&
      json.includedSegments.length > 0 &&
      json.includedSegments.every((s) => typeof s === 'string')
    ) {
      included_segments = json.includedSegments;
    }
  } catch {
    /* empty body */
  }

  console.log('[hourlyReminder] - Calling onesignal')
  const response = await fetch(ONE_SIGNAL_PUSH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify({
      app_id: appId,
      contents: { en: body },
      headings: { en: heading },
      included_segments,
    }),
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return NextResponse.json(
      {
        ok: false as const,
        error: `Invalid JSON response (HTTP ${response.status})`,
      },
      { status: 502 },
    );
  }

  const data = payload as {
    id?: string;
    errors?: unknown;
  };

  /** OneSignal often returns HTTP 200 with `id: ""` and `errors: [...]` when no one would receive the push. */
  const errorLines = Array.isArray(data.errors)
    ? data.errors.map(String).filter(Boolean)
    : [];

  console.log('[hourlyReminder] - Checking for errors')
  if (errorLines.length > 0) {
    const message = errorLines.join(' ');
    const hint =
      message.includes('not subscribed')
        ? 'Open your app in the browser, allow notifications for this site, and confirm localhost/your domain is allowed in OneSignal → Settings → Web configuration. Try Audience → Segments for the correct segment name.'
        : undefined;
    return NextResponse.json(
      {
        ok: false as const,
        error: message,
        ...(hint ? { hint } : {}),
      },
      { status: 422 },
    );
  }

  if (!response.ok) {
    const detail =
      data.errors !== undefined
        ? JSON.stringify(data.errors)
        : JSON.stringify(payload);
    return NextResponse.json(
      {
        ok: false as const,
        error: `OneSignal error (${response.status}): ${detail}`,
      },
      { status: 502 },
    );
  }

  if (!data.id) {
    return NextResponse.json(
      {
        ok: false as const,
        error: `Unexpected response: ${JSON.stringify(payload)}`,
      },
      { status: 502 },
    );
  }

  console.log('[hourlyReminder] - Done')
  return NextResponse.json({
    ok: true as const,
    notificationId: data.id,
  });
}
