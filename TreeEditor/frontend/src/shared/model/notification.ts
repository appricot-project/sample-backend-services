import { atom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

export interface Notification {
  id: number;
  message: string;
  severity: 'success' | 'error' | 'info';
}

export const notificationAtom = atom<Notification | null>(null);

export function useNotify() {
  const setNotification = useSetAtom(notificationAtom);

  return useCallback(
    (message: string, severity: Notification['severity'] = 'info') =>
      setNotification({ id: Date.now(), message, severity }),
    [setNotification],
  );
}
