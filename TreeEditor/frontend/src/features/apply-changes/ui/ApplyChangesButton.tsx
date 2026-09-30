import { useAtom } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { applySucceeded, buildApplyRequest, cacheAtom } from '@/entities/cached-node';
import { dbTreeKeys } from '@/entities/db-node';
import { treeApi } from '@/shared/api';
import { useNotify } from '@/shared/model';

export function ApplyChangesButton() {
  const [cache, setCache] = useAtom(cacheAtom);
  const queryClient = useQueryClient();
  const notify = useNotify();

  const request = buildApplyRequest(cache);
  const pendingCount = request.updates.length + request.creates.length + request.deletes.length;

  const { mutate, isPending } = useMutation({
    mutationFn: treeApi.apply,
    onSuccess: (result) => {
      setCache(applySucceeded);
      void queryClient.invalidateQueries({ queryKey: dbTreeKeys.all });
      notify(
        `Applied: ${result.updated} updated, ${result.created} created, ${result.deleted} deleted`,
        'success',
      );
    },
    onError: (error) => notify(error.message, 'error'),
  });

  return (
    <Badge badgeContent={pendingCount} color="primary">
      <Button
        size="small"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={pendingCount === 0 || isPending}
        onClick={() => mutate(request)}
      >
        Apply
      </Button>
    </Badge>
  );
}
