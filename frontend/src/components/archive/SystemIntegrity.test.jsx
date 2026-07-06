import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import SystemIntegrity from '../components/SystemIntegrity';
import TradingInterface from '../components/TradingInterface';

describe('Frontend Integrity Proof', () => {
  it('should render the Chain of Truth in SystemIntegrity component', () => {
    render(<SystemIntegrity />);
    
    // Verify steps are present
    expect(screen.getByText(/NASA POWER Satellite/i)).toBeDefined();
    expect(screen.getByText(/Chainlink Oracle/i)).toBeDefined();
    expect(screen.getByText(/Ethereum Sepolia/i)).toBeDefined();
    
    // Verify status label
    expect(screen.getByText(/PROTOCOL STATUS: RISK-BOXED/i)).toBeDefined();
  });

  it('should display the guarded margin requirement in TradingInterface', () => {
    render(<TradingInterface />);
    
    // Verify the execution preview is margin-gated instead of pretending to be a fake trade.
    expect(screen.getByText(/Required Margin/i)).toBeDefined();
    expect(screen.getByText(/Protocol Fee Est./i)).toBeDefined();
  });
});
