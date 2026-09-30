import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@mui/material/Button';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { cacheAtom, collapsedCachedIdsAtom, selectedCachedIdAtom } from '@/entities/cached-node';
import { dbTreeKeys, expandedDbIdsAtom, selectedDbIdAtom } from '@/entities/db-node';
import { treeApi } from '@/shared/api';
import { useNotify } from '@/shared/model';
import { ConfirmDialog } from '@/shared/ui';

export function ResetButton() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const notify = useNotify();
  const setCache = useSetAtom(cacheAtom);
  const setSelectedCachedId = useSetAtom(selectedCachedIdAtom);
  const setCollapsedCachedIds = useSetAtom(collapsedCachedIdsAtom);
  const setSelectedDbId = useSetAtom(selectedDbIdAtom);
  const setExpandedDbIds = useSetAtom(expandedDbIdsAtom);

  const { mutate, isPending } = useMutation({
    mutationFn: treeApi.reset,
    onSuccess: () => {
      setCache(RESET);
      setSelectedCachedId(null);
      setCollapsedCachedIds([]);
      setSelectedDbId(null);
      setExpandedDbIds([]);
      void queryClient.resetQueries({ queryKey: dbTreeKeys.all });
      notify('Database and cache were reset to sample data', 'success');
    },
    onError: (error) => notify(error.message, 'error'),
  });

  return (
    <>
      <Button
        color="inherit"
        variant="outlined"
        startIcon={<RestartAltIcon />}
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        Reset
      </Button>
      <ConfirmDialog
        open={open}
        title="Reset application?"
        message="The database will be restored to the sample data and all cached changes will be lost."
        confirmLabel="Reset"
        onConfirm={() => mutate()}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
