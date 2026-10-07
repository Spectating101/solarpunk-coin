import React, { useEffect, useRef, useState } from 'react';
import { Check, Link2 } from 'lucide-react';

const RESET_MS = 2500;

/**
 * Copies the current address. Case, policy and scenario are encoded in the URL
 * hash, so the copied link reopens the same decision.
 */
export default function CopyLinkButton({ label = 'Copy link' }) {
  const [state, setState] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setState('copied');
    } catch {
      setState('failed');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), RESET_MS);
  };

  const text = {
    idle: label,
    copied: 'Link copied',
    failed: 'Copy failed. Use the address bar',
  }[state];

  return (
    <button type="button" onClick={copy}>
      {state === 'copied' ? <Check size={15} /> : <Link2 size={15} />}
      <span aria-live="polite">{text}</span>
    </button>
  );
}
