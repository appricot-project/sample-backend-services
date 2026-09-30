import { useState } from 'react';
import { useSetAtom } from 'jotai';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {
  addChild,
  cacheAtom,
  collapsedCachedIdsAtom,
  selectedCachedIdAtom,
  useSelectedCachedNode,
} from '@/entities/cached-node';
import { ValueDialog } from '@/shared/ui';

export function AddChildButton() {
  const [open, setOpen] = useState(false);
  const parent = useSelectedCachedNode();
  const setCache = useSetAtom(cacheAtom);
  const setSelectedId = useSetAtom(selectedCachedIdAtom);
  const setCollapsedIds = useSetAtom(collapsedCachedIdsAtom);

  const handleSubmit = (value: string) => {
    if (!parent) return;
    const id = crypto.randomUUID();
    setCache((cache) => addChild(cache, parent.id, id, value));
    setCollapsedIds((ids) => ids.filter((collapsedId) => collapsedId !== parent.id));
    setSelectedId(id);
  };

  return (
    <>
      <Button
        size="small"
        startIcon={<AddIcon />}
        disabled={!parent || parent.isDeleted}
        onClick={() => setOpen(true)}
      >
        Add child
      </Button>
      <ValueDialog
        open={open && !!parent}
        title={`Add child to "${parent?.value ?? ''}"`}
        submitLabel="Add"
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
