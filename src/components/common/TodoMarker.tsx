import React from 'react';
import { extractTodoMessage } from '../../content/schema';

interface TodoMarkerProps {
  field?: string;
  message?: string;
  className?: string;
}

export function TodoMarker({ field, message, className = '' }: TodoMarkerProps) {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const cleanMsg = message ? extractTodoMessage(message) : 'Information pending';

  return (
    <span
      role="note"
      className={`inline-flex items-center gap-1.5 text-xs text-content-tertiary select-none font-sans ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
      <span className="text-content-secondary">{field ? `${field}: ` : ''}{cleanMsg}</span>
    </span>
  );
}
