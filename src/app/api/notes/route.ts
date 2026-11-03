import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { z } from 'zod';

const NoteSubmitSchema = z.object({
  visitorName: z.string().max(60).optional(),
  message: z.string().min(1).max(1000),
  category: z.enum(['feedback', 'collaboration', 'general']),
  honeypot: z.string().max(0).optional(), // Honeypot field must be empty
  timestamp: z.number().optional(),      // Minimum time-to-submit check
});

// In-memory rate limiting store (hashed IP -> timestamp[])
const rateLimitMap = new Map<string, number[]>();

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'rudar-os-salt')).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const rawIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const hashedIp = hashIp(rawIp);

    // Rate limiting: max 3 notes per 10 minutes
    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const timestamps = rateLimitMap.get(hashedIp) || [];
    const validTimestamps = timestamps.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= 3) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a few minutes before submitting another note.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = NoteSubmitSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid submission format', details: result.error.format() },
        { status: 400 }
      );
    }

    const { visitorName, message, category, honeypot, timestamp } = result.data;

    // 1. Honeypot check
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // 2. Minimum time-to-submit check (e.g. at least 1.5 seconds)
    if (timestamp && now - timestamp < 1500) {
      return NextResponse.json({ error: 'Submission too rapid' }, { status: 400 });
    }

    // 3. Update rate limit
    validTimestamps.push(now);
    rateLimitMap.set(hashedIp, validTimestamps);

    // 4. Sanitize message text (strip potential HTML tags)
    const sanitizedMsg = message.replace(/<[^>]*>?/gm, '').trim();
    const sanitizedName = visitorName ? visitorName.replace(/<[^>]*>?/gm, '').trim() : 'Guest';

    // In-memory / console log (Supabase / Neon DB adapter will hook in production)
    console.log(`[Rudar OS Note] Category: ${category} | From: ${sanitizedName} | Message: ${sanitizedMsg}`);

    return NextResponse.json(
      {
        success: true,
        noteId: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        status: 'pending',
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: `Could not save note: ${errorMsg}` }, { status: 500 });
  }
}

