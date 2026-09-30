import { atom } from 'jotai';

export const selectedDbIdAtom = atom<string | null>(null);

export const expandedDbIdsAtom = atom<string[]>([]);
