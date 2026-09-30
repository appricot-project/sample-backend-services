import { describe, expect, it } from 'vitest';
import type { TreeNodeDto } from '@/shared/api';
import type { CacheState } from '../model/types';
import {
  addChild,
  applySucceeded,
  buildApplyRequest,
  buildForest,
  editValue,
  loadNode,
  markDeleted,
} from './cache';

// Catalog(a) → Electronics(b) → Computers(c) → Laptops(d)
const dto = (id: string, parentId: string | null, value = id): TreeNodeDto => ({
  id,
  parentId,
  value,
  hasChildren: true,
  version: 1,
});

const load = (cache: CacheState, id: string, parentId: string | null, ancestorIds: string[]) =>
  loadNode(cache, dto(id, parentId), ancestorIds);

describe('cached tree', () => {
  it('links separately loaded nodes into one hierarchy', () => {
    let cache = load({}, 'c', 'b', ['a', 'b']);
    cache = load(cache, 'a', null, []);
    expect(buildForest(cache).map((n) => n.node.id)).toEqual(['a', 'c']);

    cache = load(cache, 'b', 'a', ['a']);
    const forest = buildForest(cache);
    expect(forest).toHaveLength(1);
    expect(forest[0].children[0].node.id).toBe('b');
    expect(forest[0].children[0].children[0].node.id).toBe('c');
  });

  it('does not overwrite local edits when reloading a node', () => {
    let cache = load({}, 'a', null, []);
    cache = editValue(cache, 'a', 'edited');
    cache = loadNode(cache, { ...dto('a', null), value: 'fresh' }, []);
    expect(cache.a.value).toBe('edited');
  });

  it('marks cached descendants deleted even without cached intermediate nodes', () => {
    let cache = load({}, 'b', 'a', ['a']);
    cache = load(cache, 'd', 'c', ['a', 'b', 'c']);
    cache = markDeleted(cache, 'b');
    expect(cache.b.isDeleted).toBe(true);
    expect(cache.d.isDeleted).toBe(true);
  });

  it('marks a node deleted when loaded under a pending-deleted ancestor', () => {
    let cache = load({}, 'b', 'a', ['a']);
    cache = markDeleted(cache, 'b');
    cache = load(cache, 'd', 'c', ['a', 'b', 'c']);
    expect(cache.d.isDeleted).toBe(true);
  });

  it('builds apply request with only topmost deletes and skips deleted new nodes', () => {
    let cache = load({}, 'a', null, []);
    cache = load(cache, 'b', 'a', ['a']);
    cache = load(cache, 'd', 'c', ['a', 'b', 'c']);
    cache = addChild(cache, 'd', 'new1', 'New');
    cache = editValue(cache, 'a', 'Catalog 2');
    cache = markDeleted(cache, 'b');

    expect(buildApplyRequest(cache)).toEqual({
      updates: [{ id: 'a', value: 'Catalog 2', version: 1 }],
      creates: [],
      deletes: [{ id: 'b', version: 1 }],
    });
  });

  it('sends nested creates and edits of new nodes as creates', () => {
    let cache = load({}, 'a', null, []);
    cache = addChild(cache, 'a', 'n1', 'One');
    cache = addChild(cache, 'n1', 'n2', 'Two');
    cache = editValue(cache, 'n2', 'Two edited');

    const request = buildApplyRequest(cache);
    expect(request.updates).toEqual([]);
    expect(request.creates).toEqual([
      { id: 'n1', parentId: 'a', value: 'One' },
      { id: 'n2', parentId: 'n1', value: 'Two edited' },
    ]);
    expect(cache.n2.ancestorIds).toEqual(['a', 'n1']);
  });

  it('syncs versions after a successful apply', () => {
    let cache = load({}, 'a', null, []);
    cache = load(cache, 'b', 'a', ['a']);
    cache = addChild(cache, 'a', 'n1', 'New');
    cache = editValue(cache, 'b', 'Edited');

    cache = applySucceeded(cache);
    expect(cache.a.version).toBe(1);
    expect(cache.b).toMatchObject({ version: 2, originalValue: 'Edited' });
    expect(cache.n1).toMatchObject({ isNew: false, version: 1 });
    expect(buildApplyRequest(cache)).toEqual({ updates: [], creates: [], deletes: [] });
  });
});
