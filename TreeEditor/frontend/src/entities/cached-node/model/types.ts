export interface CachedNode {
  id: string;
  parentId: string | null;
  /** Full DB path from the root; lets deletes reach cached descendants whose intermediate nodes aren't cached. */
  ancestorIds: string[];
  value: string;
  originalValue: string;
  version: number;
  isNew: boolean;
  isDeleted: boolean;
}

export type CacheState = Record<string, CachedNode>;

export interface CachedTreeNode {
  node: CachedNode;
  children: CachedTreeNode[];
}
