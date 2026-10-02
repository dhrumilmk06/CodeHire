/**
 * Unit tests for src/components/StatsCards.jsx
 *
 * StatsCards renders two stat counters (active sessions, total sessions)
 * from plain numeric props — no external dependencies.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsCards from '../../../src/components/StatsCards.jsx';

describe('StatsCards', () => {
  test('renders the "Active Sessions" label', () => {
    render(<StatsCards activeSessionsCount={0} recentSessionsCount={0} />);
    expect(screen.getByText(/Active Sessions/i)).toBeInTheDocument();
  });

  test('renders the "Total Sessions" label', () => {
    render(<StatsCards activeSessionsCount={0} recentSessionsCount={0} />);
    expect(screen.getByText(/Total Sessions/i)).toBeInTheDocument();
  });

  test('displays the correct activeSessionsCount', () => {
    render(<StatsCards activeSessionsCount={5} recentSessionsCount={0} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('displays the correct recentSessionsCount', () => {
    render(<StatsCards activeSessionsCount={0} recentSessionsCount={12} />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  test('displays both counts simultaneously', () => {
    render(<StatsCards activeSessionsCount={3} recentSessionsCount={27} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('27')).toBeInTheDocument();
  });

  test('renders the "Live" badge', () => {
    render(<StatsCards activeSessionsCount={1} recentSessionsCount={0} />);
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  test('renders with zero counts without crashing', () => {
    const { container } = render(
      <StatsCards activeSessionsCount={0} recentSessionsCount={0} />
    );
    expect(container).toBeTruthy();
    // Both zeros should appear in the document
    expect(screen.getAllByText('0')).toHaveLength(2);
  });

  test('updates when different props are passed', () => {
    const { rerender } = render(
      <StatsCards activeSessionsCount={1} recentSessionsCount={10} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(<StatsCards activeSessionsCount={99} recentSessionsCount={10} />);
    expect(screen.getByText('99')).toBeInTheDocument();
  });
});
