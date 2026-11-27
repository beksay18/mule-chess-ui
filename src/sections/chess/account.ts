import type { CurrentUser, SignInResponse } from 'src/api/auth';

import { useSyncExternalStore } from 'react';

import { logoutSession, getCurrentUser, SessionStorage } from 'src/api';

// ----------------------------------------------------------------------

let account: CurrentUser | null = readAccount();
const listeners = new Set<() => void>();

function readAccount() {
  try {
    return getCurrentUser();
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAccount() {
  return useSyncExternalStore(subscribe, () => account, () => null);
}

export function saveAccount(response: SignInResponse) {
  const next: CurrentUser = {
    userId: response.id,
    username: response.username,
    role: response.role,
    person: response.person ?? { firstName: '', lastName: '', phoneNumber: null },
  };
  SessionStorage.setJSONValue('access-token', { 'access-token': response.accessToken });
  SessionStorage.setJSONValue('current-user', next as unknown as Record<string, unknown>);
  account = next;
  emit();
}

export async function signOut() {
  await logoutSession();
  account = null;
  emit();
}
