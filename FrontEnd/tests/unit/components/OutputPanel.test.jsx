/**
 * Unit tests for src/components/OutputPanel.jsx
 *
 * OutputPanel renders code execution results based on the `output` prop.
 * No external service dependencies — renders purely from props.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OutputPanel } from '../../../src/components/OutputPanel.jsx';

describe('OutputPanel', () => {
  // ── Idle state (output = null) ───────────────────────────────────────────────

  describe('when output is null (idle)', () => {
    test('renders the "Output" heading', () => {
      render(<OutputPanel output={null} isRunning={false} />);
      expect(screen.getByText('Output')).toBeInTheDocument();
    });

    test('shows the placeholder prompt text', () => {
      render(<OutputPanel output={null} isRunning={false} />);
      expect(
        screen.getByText(/Click "Run Code" to see the output here/)
      ).toBeInTheDocument();
    });

    test('does not show a loading spinner when idle', () => {
      render(<OutputPanel output={null} isRunning={false} />);
      expect(document.querySelector('.loading')).not.toBeInTheDocument();
    });
  });

  // ── Running state ────────────────────────────────────────────────────────────

  describe('when isRunning is true', () => {
    test('shows the loading spinner', () => {
      render(<OutputPanel output={null} isRunning={true} />);
      expect(document.querySelector('.loading')).toBeInTheDocument();
    });
  });

  // ── Successful output ────────────────────────────────────────────────────────

  describe('when output is successful', () => {
    test('displays the stdout output text', () => {
      render(
        <OutputPanel
          output={{ success: true, output: 'Hello, World!' }}
          isRunning={false}
        />
      );
      expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    });

    test('shows "(no output)" message when stdout is empty', () => {
      render(
        <OutputPanel
          output={{ success: true, output: '' }}
          isRunning={false}
        />
      );
      expect(screen.getByText(/Execution finished \(no output\)/)).toBeInTheDocument();
    });

    test('also shows a warning when stderr is present alongside success', () => {
      render(
        <OutputPanel
          output={{ success: true, output: 'ok', error: 'some warning' }}
          isRunning={false}
        />
      );
      expect(screen.getByText('ok')).toBeInTheDocument();
      expect(screen.getByText('some warning')).toBeInTheDocument();
    });
  });

  // ── Error output ─────────────────────────────────────────────────────────────

  describe('when output has an error', () => {
    test('displays the error message', () => {
      render(
        <OutputPanel
          output={{ success: false, error: 'SyntaxError: Unexpected token' }}
          isRunning={false}
        />
      );
      expect(screen.getByText('SyntaxError: Unexpected token')).toBeInTheDocument();
    });

    test('shows "Unknown Error" as fallback when error is missing', () => {
      render(
        <OutputPanel
          output={{ success: false }}
          isRunning={false}
        />
      );
      expect(screen.getByText('Unknown Error')).toBeInTheDocument();
    });

    test('shows partial stdout alongside the error', () => {
      render(
        <OutputPanel
          output={{ success: false, output: 'partial output', error: 'Runtime error' }}
          isRunning={false}
        />
      );
      expect(screen.getByText('partial output')).toBeInTheDocument();
      expect(screen.getByText('Runtime error')).toBeInTheDocument();
    });
  });
});
