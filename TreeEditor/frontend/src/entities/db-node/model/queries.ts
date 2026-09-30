import { useInfiniteQuery, type InfiniteData, type QueryClient } from '@tanstack/react-query';
import { treeApi, type PagedResult, type TreeNodeDto } from '@/shared/api';

const PAGE_SIZE = 50;

export const dbTreeKeys = {
  all: ['tree'] as const,
  children: (parentId: string | null) => ['tree', 'children', parentId ?? 'root'] as const,
};

export function useDbChildren(parentId: string | null) {
  return useInfiniteQuery({
    queryKey: dbTreeKeys.children(parentId),
    queryFn: ({ pageParam }) => treeApi.getChildren(parentId, pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.skip + lastPage.take : undefined),
  });
}

export interface LoadedDbNode {
  node: TreeNodeDto;
  ancestorIds: string[];
}

/**
 * DBTreeView loads level by level from the roots, so every visible node's ancestors
 * are already in the query cache and its full path can be resolved without a request.
 */
export function findLoadedDbNode(queryClient: QueryClient, id: string): LoadedDbNode | null {
  const index = new Map<string, TreeNodeDto>();
  const pages = queryClient.getQueriesData<InfiniteData<PagedResult<TreeNodeDto>>>({
    queryKey: [...dbTreeKeys.all, 'children'],
  });

  for (const [, data] of pages) {
    data?.pages.forEach((page) => page.items.forEach((item) => index.set(item.id, item)));
  }

  const node = index.get(id);
  if (!node) return null;

  const ancestorIds: string[] = [];
  for (let parentId = node.parentId; parentId; parentId = index.get(parentId)?.parentId ?? null) {
    ancestorIds.unshift(parentId);
  }

  return { node, ancestorIds };
}
