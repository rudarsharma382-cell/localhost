import React from 'react';
import { extractTodoMessage } from '../../content/schema';

interface TodoMarkerProps {
  field: string;
  message?: string;
  className?: string;
}

export function TodoMarker({ field, message, className = '' }: TodoMarkerProps) {
  // In production, degrade cleanly without breaking
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const cleanMsg = message ? extractTodoMessage(message) : 'Missing content required from Rudar';

  return (
    <div
      role="note"
      aria-label={`Pending content: ${field}`}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-sm border border-semantic-warning/40 bg-surface-raised text-semantic-warning font-mono text-xs select-none ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-semantic-warning animate-pulse" />
      <span className="font-semibold uppercase tracking-wider text-[10px] text-content-primary">TODO [{field}]:</span>
      <span className="text-content-secondary truncate max-w-[280px]">{cleanMsg}</span>
    </div>
  );
}
