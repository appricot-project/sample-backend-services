import Chip from '@mui/material/Chip';
import { isModified } from '../lib/cache';
import type { CachedNode } from '../model/types';

export function CachedNodeLabel({ node }: { node: CachedNode }) {
  return (
    <span className="flex items-center gap-2">
      <span className={node.isDeleted ? 'text-gray-400 line-through' : undefined}>{node.value}</span>
      {node.isDeleted && <Chip size="small" label="deleted" variant="outlined" />}
      {!node.isDeleted && node.isNew && <Chip size="small" label="new" color="success" variant="outlined" />}
      {isModified(node) && <Chip size="small" label="edited" color="warning" variant="outlined" />}
    </span>
  );
}
