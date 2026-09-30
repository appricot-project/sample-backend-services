import { atom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { CacheState } from './types';

export const cacheAtom = atomWithStorage<CacheState>('tree-editor-cache', {}, undefined, {
  getOnInit: true,
});

export const selectedCachedIdAtom = atom<string | null>(null);

export const collapsedCachedIdsAtom = atom<string[]>([]);

export const selectedCachedNodeAtom = atom((get) => {
  const id = get(selectedCachedIdAtom);
  return id ? (get(cacheAtom)[id] ?? null) : null;
});

export const useSelectedCachedNode = () => useAtomValue(selectedCachedNodeAtom);
