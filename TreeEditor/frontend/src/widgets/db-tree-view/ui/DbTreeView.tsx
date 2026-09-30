import { useAtom, useAtomValue } from 'jotai';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { cacheAtom } from '@/entities/cached-node';
import { expandedDbIdsAtom, selectedDbIdAtom, useDbChildren } from '@/entities/db-node';
import { LoadToCacheButton } from '@/features/load-to-cache';
import type { TreeNodeDto } from '@/shared/api';
import { Panel } from '@/shared/ui';

const serviceId = (parentId: string | null, kind: string) => `${parentId ?? 'root'}::${kind}`;

export function DbTreeView() {
  const [expandedIds, setExpandedIds] = useAtom(expandedDbIdsAtom);
  const [selectedId, setSelectedId] = useAtom(selectedDbIdAtom);

  return (
    <Panel
      title="Database"
      subtitle="Loaded lazily, one level at a time"
      actions={<LoadToCacheButton />}
    >
      <SimpleTreeView
        expandedItems={expandedIds}
        onExpandedItemsChange={(_, ids) => setExpandedIds(ids)}
        selectedItems={selectedId}
        onSelectedItemsChange={(_, id) => setSelectedId(id)}
      >
        <DbChildren parentId={null} />
      </SimpleTreeView>
    </Panel>
  );
}

function DbChildren({ parentId }: { parentId: string | null }) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useDbChildren(parentId);

  if (isPending) {
    return (
      <TreeItem
        itemId={serviceId(parentId, 'loading')}
        disableSelection
        label={<CircularProgress size={14} />}
      />
    );
  }

  if (isError) {
    return (
      <TreeItem
        itemId={serviceId(parentId, 'error')}
        disableSelection
        label={
          <span className="flex items-center gap-2 text-red-600">
            {error.message}
            <Button
              size="small"
              disabled={isRefetching}
              onClick={(event) => {
                event.stopPropagation();
                void refetch();
              }}
            >
              Retry
            </Button>
          </span>
        }
      />
    );
  }

  const nodes = data.pages.flatMap((page) => page.items);

  return (
    <>
      {nodes.map((node) => (
        <DbTreeItem key={node.id} node={node} />
      ))}
      {hasNextPage && (
        <TreeItem
          itemId={serviceId(parentId, 'more')}
          disableSelection
          label={
            <Button
              size="small"
              disabled={isFetchingNextPage}
              onClick={(event) => {
                event.stopPropagation();
                void fetchNextPage();
              }}
            >
              Load more
            </Button>
          }
        />
      )}
    </>
  );
}

function DbTreeItem({ node }: { node: TreeNodeDto }) {
  const isExpanded = useAtomValue(expandedDbIdsAtom).includes(node.id);
  const isCached = node.id in useAtomValue(cacheAtom);

  return (
    <TreeItem
      itemId={node.id}
      label={
        <span className="flex items-center gap-2">
          {node.value}
          {isCached && <Chip size="small" label="cached" variant="outlined" color="primary" />}
        </span>
      }
    >
      {node.hasChildren &&
        (isExpanded ? (
          <DbChildren parentId={node.id} />
        ) : (
          // Placeholder so the expand icon is shown before children are fetched.
          <TreeItem itemId={serviceId(node.id, 'placeholder')} disableSelection />
        ))}
    </TreeItem>
  );
}
