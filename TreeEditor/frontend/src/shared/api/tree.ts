import { http } from './http';

export interface TreeNodeDto {
  id: string;
  parentId: string | null;
  value: string;
  hasChildren: boolean;
  version: number;
}

export interface PagedResult<T> {
  items: T[];
  skip: number;
  take: number;
  hasMore: boolean;
}

export interface ApplyChangesRequest {
  updates: { id: string; value: string; version: number }[];
  creates: { id: string; parentId: string | null; value: string }[];
  deletes: { id: string; version: number }[];
}

export interface ApplyChangesResult {
  updated: number;
  created: number;
  deleted: number;
}

export const treeApi = {
  getChildren(parentId: string | null, skip: number, take: number) {
    const query = `?skip=${skip}&take=${take}`;
    const path = parentId ? `/tree/nodes/${parentId}/children` : '/tree/roots';
    return http<PagedResult<TreeNodeDto>>(path + query);
  },

  apply(request: ApplyChangesRequest) {
    return http<ApplyChangesResult>('/tree/apply', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  reset() {
    return http<void>('/tree/reset', { method: 'POST' });
  },
};
