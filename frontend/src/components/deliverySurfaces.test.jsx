import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CopyLinkButton from './CopyLinkButton';
import PublicEvidenceCheckpoint from './PublicEvidenceCheckpoint';
import SiteFooter from './SiteFooter';
import SourceAndLimits, { joinOr } from './platform/SourceAndLimits';
import { PUBLIC_EVIDENCE_CHECKPOINT as checkpoint } from '../data/publicEvidenceCheckpoint';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('SourceAndLimits', () => {
  it('renders a titled note and joins items as a disjunction', () => {
    render(<SourceAndLimits title="What a receipt proves">It proves lineage.</SourceAndLimits>);
    const note = screen.getByRole('note');
    expect(note).toHaveTextContent('What a receipt proves');
    expect(note).toHaveTextContent('It proves lineage.');
    expect(joinOr(['a', 'b', 'c'])).toBe('a, b, or c');
  });
});

describe('PublicEvidenceCheckpoint limits', () => {
  it('states every declared non-claim and the untested R4 boundary in both layouts', () => {
    for (const compact of [true, false]) {
      const { unmount } = render(<PublicEvidenceCheckpoint compact={compact} />);
      const note = screen.getByRole('note');
      for (const claim of checkpoint.non_claims) expect(note).toHaveTextContent(claim);
      expect(note).toHaveTextContent('actual assurance L0');
      expect(note).toHaveTextContent('R4 monetary performance is untested');
      unmount();
    }
  });
});

describe('CopyLinkButton', () => {
  it('copies the current address and confirms, then resets', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<CopyLinkButton />);

    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /copy link/i })); });
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(screen.getByText('Link copied')).toBeInTheDocument();

    await act(async () => { vi.advanceTimersByTime(3000); });
    expect(screen.getByText('Copy link')).toBeInTheDocument();
  });

  it('tells the person what to do when the clipboard is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    render(<CopyLinkButton />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /copy link/i })); });
    expect(screen.getByText(/copy failed\. use the address bar/i)).toBeInTheDocument();
  });
});

describe('SiteFooter', () => {
  it('links the governance, privacy, security and public-interest documents and states what the project is not', () => {
    render(<SiteFooter />);
    const nav = screen.getByRole('navigation', { name: /project documents/i });
    for (const [name, file] of [
      [/public-interest/i, 'PUBLIC_INTEREST.md'],
      [/governance/i, 'GOVERNANCE.md'],
      [/privacy/i, 'PRIVACY.md'],
      [/security/i, 'SECURITY.md'],
      [/code of conduct/i, 'CODE_OF_CONDUCT.md'],
      [/licence/i, 'LICENSE'],
    ]) {
      const link = screen.getAllByRole('link', { name }).find((el) => nav.contains(el));
      expect(link).toHaveAttribute('href', expect.stringMatching(new RegExp(`/blob/main/${file}$`)));
    }
    expect(screen.getByText(/not a token, a financial product/i)).toBeInTheDocument();
  });
});
