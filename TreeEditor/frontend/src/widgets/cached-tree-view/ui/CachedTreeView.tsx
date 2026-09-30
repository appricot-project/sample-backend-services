import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import Typography from '@mui/material/Typography';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  buildForest,
  cacheAtom,
  CachedNodeLabel,
  collapsedCachedIdsAtom,
  selectedCachedIdAtom,
  type CachedTreeNode,
} from '@/entities/cached-node';
import { AddChildButton } from '@/features/add-child';
import { ApplyChangesButton } from '@/features/apply-changes';
import { DeleteNodeButton } from '@/features/delete-node';
import { EditNodeButton } from '@/features/edit-node';
import { Panel } from '@/shared/ui';

export function CachedTreeView() {
  const cache = useAtomValue(cacheAtom);
  const [selectedId, setSelectedId] = useAtom(selectedCachedIdAtom);
  const [collapsedIds, setCollapsedIds] = useAtom(collapsedCachedIdsAtom);

  const forest = useMemo(() => buildForest(cache), [cache]);
  const allIds = useMemo(() => Object.keys(cache), [cache]);
  // Cached nodes are expanded by default, so only collapsed ones are tracked.
  const expandedIds = useMemo(
    () => allIds.filter((id) => !collapsedIds.includes(id)),
    [allIds, collapsedIds],
  );

  return (
    <Panel
      title="Cache"
      subtitle="Changes stay local until Apply"
      actions={
        <>
          <AddChildButton />
          <EditNodeButton />
          <DeleteNodeButton />
          <ApplyChangesButton />
        </>
      }
    >
      {forest.length === 0 ? (
        <Typography variant="body2" color="text.secondary" className="p-4 text-center">
          Select a node in the database tree and press Load.
        </Typography>
      ) : (
        <SimpleTreeView
          expandedItems={expandedIds}
          onExpandedItemsChange={(_, ids) =>
            setCollapsedIds(allIds.filter((id) => !ids.includes(id)))
          }
          selectedItems={selectedId && selectedId in cache ? selectedId : null}
          onSelectedItemsChange={(_, id) => setSelectedId(id)}
        >
          {forest.map((treeNode) => (
            <CachedTreeItem key={treeNode.node.id} treeNode={treeNode} />
          ))}
        </SimpleTreeView>
      )}
    </Panel>
  );
}

function CachedTreeItem({ treeNode }: { treeNode: CachedTreeNode }) {
  return (
    <TreeItem itemId={treeNode.node.id} label={<CachedNodeLabel node={treeNode.node} />}>
      {treeNode.children.map((child) => (
        <CachedTreeItem key={child.node.id} treeNode={child} />
      ))}
    </TreeItem>
  );
}
