/**
 * Unit tests for src/hooks/useSessions.js
 *
 * All TanStack Query hooks (useQuery / useMutation) and the axios/toast
 * dependencies are mocked so these tests run without a network or server.
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../src/api/sessions.js', () => ({
  sessionApi: {
    createSession: jest.fn(),
    getActiveSessions: jest.fn(),
    getMyReecentSessions: jest.fn(),
    getSessionById: jest.fn(),
    joinSession: jest.fn(),
    endSession: jest.fn(),
  },
}));

import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { sessionApi } from '../../../src/api/sessions.js';
import {
  useCreateSession,
  useActiveSessions,
  useMyRecentSessions,
  useSessionById,
  useJoinSession,
  useEndSession,
} from '../../../src/hooks/useSessions.js';

// ─── useActiveSessions ────────────────────────────────────────────────────────

describe('useActiveSessions', () => {
  test('calls useQuery with correct queryKey and queryFn', () => {
    const mockReturn = { data: [], isLoading: false };
    useQuery.mockReturnValue(mockReturn);

    const result = useActiveSessions();

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['activeSessions'],
      queryFn: sessionApi.getActiveSessions,
    });
    expect(result).toBe(mockReturn);
  });
});

// ─── useMyRecentSessions ──────────────────────────────────────────────────────

describe('useMyRecentSessions', () => {
  test('calls useQuery with correct queryKey and queryFn', () => {
    const mockReturn = { data: [], isLoading: false };
    useQuery.mockReturnValue(mockReturn);

    const result = useMyRecentSessions();

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['myRecentSessions'],
      queryFn: sessionApi.getMyReecentSessions,
    });
    expect(result).toBe(mockReturn);
  });
});

// ─── useSessionById ───────────────────────────────────────────────────────────

describe('useSessionById', () => {
  beforeEach(() => useQuery.mockClear());

  test('calls useQuery with sessionId in queryKey', () => {
    useQuery.mockReturnValue({ data: null });
    useSessionById('session-123');

    const callArgs = useQuery.mock.calls[0][0];
    expect(callArgs.queryKey).toEqual(['session', 'session-123']);
  });

  test('enabled is true when id is provided', () => {
    useQuery.mockReturnValue({ data: null });
    useSessionById('abc');

    const callArgs = useQuery.mock.calls[0][0];
    expect(callArgs.enabled).toBe(true);
  });

  test('enabled is false when id is falsy', () => {
    useQuery.mockReturnValue({ data: null });
    useSessionById('');

    const callArgs = useQuery.mock.calls[0][0];
    expect(callArgs.enabled).toBe(false);
  });

  test('refetchInterval is set to 5000ms', () => {
    useQuery.mockReturnValue({ data: null });
    useSessionById('abc');

    const callArgs = useQuery.mock.calls[0][0];
    expect(callArgs.refetchInterval).toBe(5000);
  });
});

// ─── useCreateSession ─────────────────────────────────────────────────────────

describe('useCreateSession', () => {
  beforeEach(() => useMutation.mockClear());

  test('calls useMutation with createSession mutationFn', () => {
    const mockReturn = { mutate: jest.fn() };
    useMutation.mockReturnValue(mockReturn);

    const result = useCreateSession();

    expect(useMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: sessionApi.createSession,
        mutationKey: ['createSession'],
      })
    );
    expect(result).toBe(mockReturn);
  });

  test('onSuccess shows a success toast', () => {
    useMutation.mockImplementation(({ onSuccess }) => {
      onSuccess(); // call the callback immediately
      return {};
    });

    useCreateSession();
    expect(toast.success).toHaveBeenCalledWith('Session created successfully!');
  });

  test('onError shows an error toast', () => {
    const mockError = { response: { data: { message: 'Server error' } } };
    useMutation.mockImplementation(({ onError }) => {
      onError(mockError);
      return {};
    });

    useCreateSession();
    expect(toast.error).toHaveBeenCalledWith('Server error');
  });

  test('onError falls back to default message when response message is absent', () => {
    useMutation.mockImplementation(({ onError }) => {
      onError({});
      return {};
    });

    useCreateSession();
    expect(toast.error).toHaveBeenCalledWith('Failed to create room');
  });
});

// ─── useJoinSession ───────────────────────────────────────────────────────────

describe('useJoinSession', () => {
  beforeEach(() => useMutation.mockClear());

  test('calls useMutation with joinSession mutationFn', () => {
    useMutation.mockReturnValue({});
    useJoinSession();

    expect(useMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: sessionApi.joinSession,
        mutationKey: ['joinSession'],
      })
    );
  });

  test('onSuccess shows "Joined session successfully!" toast', () => {
    useMutation.mockImplementation(({ onSuccess }) => {
      onSuccess();
      return {};
    });

    useJoinSession();
    expect(toast.success).toHaveBeenCalledWith('Joined session successfully!');
  });
});

// ─── useEndSession ────────────────────────────────────────────────────────────

describe('useEndSession', () => {
  beforeEach(() => useMutation.mockClear());

  test('calls useMutation with endSession mutationFn', () => {
    useMutation.mockReturnValue({});
    useEndSession();

    expect(useMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationFn: sessionApi.endSession,
        mutationKey: ['endSession'],
      })
    );
  });

  test('onSuccess shows "Session ended successfully!" toast', () => {
    useMutation.mockImplementation(({ onSuccess }) => {
      onSuccess();
      return {};
    });

    useEndSession();
    expect(toast.success).toHaveBeenCalledWith('Session ended successfully!');
  });
});
