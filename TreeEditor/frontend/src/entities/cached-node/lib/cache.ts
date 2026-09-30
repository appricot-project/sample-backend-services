import type { ApplyChangesRequest, TreeNodeDto } from '@/shared/api';
import type { CacheState, CachedNode, CachedTreeNode } from '../model/types';

export const isModified = (node: CachedNode) =>
  !node.isNew && !node.isDeleted && node.value !== node.originalValue;

const isDescendantOf = (node: CachedNode, ancestorId: string) =>
  node.ancestorIds.includes(ancestorId);

export function loadNode(cache: CacheState, dto: TreeNodeDto, ancestorIds: string[]): CacheState {
  const existing = cache[dto.id];

  if (existing) {
    const isClean = !existing.isNew && !existing.isDeleted && !isModified(existing);
    if (!isClean) return cache;
    return {
      ...cache,
      [dto.id]: { ...existing, value: dto.value, originalValue: dto.value, version: dto.version },
    };
  }

  const hasDeletedAncestor = ancestorIds.some((id) => cache[id]?.isDeleted);

  return {
    ...cache,
    [dto.id]: {
      id: dto.id,
      parentId: dto.parentId,
      ancestorIds,
      value: dto.value,
      originalValue: dto.value,
      version: dto.version,
      isNew: false,
      isDeleted: hasDeletedAncestor,
    },
  };
}

export function addChild(cache: CacheState, parentId: string, id: string, value: string): CacheState {
  const parent = cache[parentId];
  if (!parent || parent.isDeleted) return cache;

  return {
    ...cache,
    [id]: {
      id,
      parentId,
      ancestorIds: [...parent.ancestorIds, parentId],
      value,
      originalValue: value,
      version: 0,
      isNew: true,
      isDeleted: false,
    },
  };
}

export function editValue(cache: CacheState, id: string, value: string): CacheState {
  const node = cache[id];
  if (!node || node.isDeleted) return cache;
  return { ...cache, [id]: { ...node, value } };
}

export function markDeleted(cache: CacheState, id: string): CacheState {
  if (!cache[id] || cache[id].isDeleted) return cache;

  const next: CacheState = {};
  for (const node of Object.values(cache)) {
    const affected = node.id === id || isDescendantOf(node, id);
    next[node.id] = affected && !node.isDeleted ? { ...node, isDeleted: true } : node;
  }
  return next;
}

const compareNodes = (a: CachedTreeNode, b: CachedTreeNode) =>
  a.node.value.localeCompare(b.node.value) || a.node.id.localeCompare(b.node.id);

export function buildForest(cache: CacheState): CachedTreeNode[] {
  const treeNodes = new Map<string, CachedTreeNode>();
  for (const node of Object.values(cache)) {
    treeNodes.set(node.id, { node, children: [] });
  }

  const roots: CachedTreeNode[] = [];
  for (const treeNode of treeNodes.values()) {
    const parent = treeNode.node.parentId ? treeNodes.get(treeNode.node.parentId) : undefined;
    (parent ? parent.children : roots).push(treeNode);
  }

  const sort = (nodes: CachedTreeNode[]) => {
    nodes.sort(compareNodes);
    nodes.forEach((treeNode) => sort(treeNode.children));
  };
  sort(roots);

  return roots;
}

export function buildApplyRequest(cache: CacheState): ApplyChangesRequest {
  const nodes = Object.values(cache);
  const request: ApplyChangesRequest = { updates: [], creates: [], deletes: [] };

  for (const node of nodes) {
    if (node.isDeleted) {
      if (node.isNew) continue;
      // The DB cascades deletes, so only the topmost deleted nodes are sent;
      // a separate delete for a cascaded descendant would find no row and fail with a conflict.
      const coveredByAncestor = node.ancestorIds.some(
        (ancestorId) => cache[ancestorId]?.isDeleted && !cache[ancestorId].isNew,
      );
      if (!coveredByAncestor) request.deletes.push({ id: node.id, version: node.version });
    } else if (node.isNew) {
      request.creates.push({ id: node.id, parentId: node.parentId, value: node.value });
    } else if (isModified(node)) {
      request.updates.push({ id: node.id, value: node.value, version: node.version });
    }
  }

  return request;
}
