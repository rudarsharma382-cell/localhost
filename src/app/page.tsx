import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-canvas text-content-primary flex flex-col items-center justify-center p-6 selection:bg-accent/20 selection:text-accent font-sans">
      <div className="max-w-xl w-full p-8 rounded-lg bg-surface-base border border-border-default shadow-window space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="font-display font-bold text-lg tracking-tight">RUDAR OS</span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-surface-panel border border-border-default text-accent">
            GATE 1 READY
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-xl font-display font-bold text-content-primary">
            Phase 0 Complete &bull; Identity Specification Awaiting Approval
          </h1>
          <p className="text-sm text-content-secondary leading-relaxed">
            Phase 0 setup is verified: Next.js with strict TypeScript, Tailwind with design tokens,
            Zod typed content layer, and automatic <code className="text-accent font-mono text-xs">MISSING_CONTENT.md</code> generator.
          </p>
          <p className="text-sm text-content-secondary leading-relaxed">
            Per Step 3 instructions, the full visual identity specification has been delivered in{' '}
            <code className="text-content-primary font-mono text-xs">DESIGN_PROPOSAL.md</code> and the live design tokens, states, and app icons are interactive on the dev styleguide.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dev/styleguide"
            className="flex-1 py-2.5 px-4 rounded-sm bg-accent text-surface-canvas text-xs font-medium text-center hover:bg-accent-hover transition-colors duration-instant"
          >
            Launch Dev Styleguide (/dev/styleguide) &rarr;
          </Link>
        </div>

        <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-content-tertiary">
          <span>Rudar OS Build Engine</span>
          <span>Awaiting Gate 1 Approval</span>
        </div>
      </div>
    </main>
  );
}
