import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import StudyProofNavigator from './StudyProofNavigator';

function installHeader() {
  const header = document.createElement('header');
  header.className = 'app-minimal-top';
  document.body.prepend(header);
  return header;
}

function setHash(value) {
  window.history.replaceState(null, '', `${window.location.pathname}${value}`);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  document.body.className = '';
  window.history.replaceState(null, '', window.location.pathname);
});

describe('StudyProofNavigator', () => {
  it('stays absent outside the Studies routes', async () => {
    installHeader();
    setHash('#cases');
    render(<StudyProofNavigator />);

    await waitFor(() => {
      expect(screen.queryByLabelText(/studies empirical proof layer/i)).not.toBeInTheDocument();
    });
    expect(document.body).not.toHaveClass('study-proof-active');
  });

  it('connects the decision brief to evidence, verification, and controlled mechanics', async () => {
    installHeader();
    setHash('#runs');
    render(<StudyProofNavigator />);

    const layer = await screen.findByLabelText(/studies empirical proof layer/i);
    expect(layer).toBeInTheDocument();
    expect(document.body).toHaveClass('study-proof-active');
    expect(screen.getByRole('navigation', { name: /study proof layer navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /decision brief/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /full study/i })).toHaveAttribute('href', '#study');
    expect(screen.getByRole('link', { name: /verify bundle/i })).toHaveAttribute('href', '#reproduce');
    expect(screen.getByRole('link', { name: /controlled mechanics/i }).getAttribute('href')).toContain('#case/TYN-001');
    expect(screen.getByText(/connected by the analytical method/i)).toBeInTheDocument();
  });

  it('updates the proof boundary when the route moves to byte verification', async () => {
    installHeader();
    setHash('#runs');
    render(<StudyProofNavigator />);
    await screen.findByRole('link', { name: /decision brief/i });

    setHash('#reproduce');

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /verify bundle/i })).toHaveAttribute('aria-current', 'page');
    });
    expect(screen.getByText(/does not certify licensed source truth/i)).toBeInTheDocument();
  });

  it('keeps the mobile disclosure operable with native details semantics', async () => {
    installHeader();
    setHash('#runs');
    render(<StudyProofNavigator />);

    const disclosure = await screen.findByText(/start with the empirical decision/i);
    const details = disclosure.closest('details');
    expect(details).not.toBeNull();
    fireEvent.click(details.querySelector('summary'));
    expect(details).toBeInTheDocument();
  });
});
