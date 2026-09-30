import { useState } from 'react';
import { useSetAtom } from 'jotai';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { cacheAtom, editValue, useSelectedCachedNode } from '@/entities/cached-node';
import { ValueDialog } from '@/shared/ui';

export function EditNodeButton() {
  const [open, setOpen] = useState(false);
  const node = useSelectedCachedNode();
  const setCache = useSetAtom(cacheAtom);

  return (
    <>
      <Button
        size="small"
        startIcon={<EditIcon />}
        disabled={!node || node.isDeleted}
        onClick={() => setOpen(true)}
      >
        Edit
      </Button>
      <ValueDialog
        open={open && !!node}
        title="Edit value"
        submitLabel="Save"
        initialValue={node?.value}
        onClose={() => setOpen(false)}
        onSubmit={(value) => node && setCache((cache) => editValue(cache, node.id, value))}
      />
    </>
  );
}
