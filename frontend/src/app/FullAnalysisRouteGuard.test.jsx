import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FullAnalysisRouteGuard from './FullAnalysisRouteGuard';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

describe('FullAnalysisRouteGuard', () => {
  it('marks specialist deep links as full analysis and announces the URL state change', () => {
    window.history.replaceState(null, '', '/#verify?tool=capsule');
    const listener = vi.fn();
    window.addEventListener('popstate', listener);

    render(<FullAnalysisRouteGuard />);

    expect(new URLSearchParams(window.location.search).get('view')).toBe('full');
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('popstate', listener);
  });

  it('leaves the five primary Overview routes unchanged', () => {
    window.history.replaceState(null, '', '/#research');

    render(<FullAnalysisRouteGuard />);

    expect(window.location.search).toBe('');
  });

  it('synchronizes later specialist navigation through hash changes', () => {
    window.history.replaceState(null, '', '/#programme');
    render(<FullAnalysisRouteGuard />);

    window.history.replaceState(null, '', '/#case/TYN-001');
    window.dispatchEvent(new Event('hashchange'));

    expect(new URLSearchParams(window.location.search).get('view')).toBe('full');
  });
});
