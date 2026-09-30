import { useSetAtom } from 'jotai';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { cacheAtom, markDeleted, useSelectedCachedNode } from '@/entities/cached-node';

export function DeleteNodeButton() {
  const node = useSelectedCachedNode();
  const setCache = useSetAtom(cacheAtom);

  return (
    <Button
      size="small"
      color="error"
      startIcon={<DeleteIcon />}
      disabled={!node || node.isDeleted}
      onClick={() => node && setCache((cache) => markDeleted(cache, node.id))}
    >
      Delete
    </Button>
  );
}
