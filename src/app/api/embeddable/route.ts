import { NextRequest, NextResponse } from 'next/server';
import { projects } from '@/content/projects';

export const dynamic = 'force-dynamic';

// Strict allowlist: only URLs defined in verified project content
const ALLOWLISTED_HOSTS = new Set([
  'rudar.vercel.app',
  'github.com',
  'linkedin.com',
  'www.linkedin.com',
  'getsafeware.vercel.app',
  'bmwm4csl.vercel.app',
  'monolithhouse.vercel.app',
  'arc-motion.vercel.app',
  'soleagent.vercel.app',
  'divineherbalife.in',
  'clothing-store-5e2.pages.dev',
  ...projects
    .filter((p) => p.liveUrl)
    .map((p) => {
      try {
        return new URL(p.liveUrl!).hostname;
      } catch {
        return '';
      }
    })
    .filter(Boolean),
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return NextResponse.json({ embeddable: false, reason: 'Invalid URL format' }, { status: 400 });
  }

  // SSRF Protection: strictly allowlisted hosts only
  if (!ALLOWLISTED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json(
      {
        embeddable: false,
        reason: 'Host is not on the verified portfolio allowlist',
      },
      { status: 403 }
    );
  }

  try {
    // Probe headers with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(targetUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RudarOS/1.0',
      },
    });

    clearTimeout(timeout);

    const xFrameOptions = (res.headers.get('x-frame-options') || '').toLowerCase();
    const csp = (res.headers.get('content-security-policy') || '').toLowerCase();

    // Check for framing restrictions
    if (xFrameOptions.includes('deny') || xFrameOptions.includes('sameorigin')) {
      return NextResponse.json({
        embeddable: false,
        reason: `Blocked by X-Frame-Options: ${xFrameOptions}`,
      });
    }

    if (csp.includes('frame-ancestors') && !csp.includes("frame-ancestors *") && !csp.includes('frame-ancestors https:')) {
      return NextResponse.json({
        embeddable: false,
        reason: 'Restricted by Content-Security-Policy frame-ancestors directive',
      });
    }

    return NextResponse.json({
      embeddable: true,
      status: res.status,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Probe connection failed';
    return NextResponse.json({
      embeddable: false,
      reason: `Could not verify framing headers: ${errorMsg}`,
    });
  }
}

