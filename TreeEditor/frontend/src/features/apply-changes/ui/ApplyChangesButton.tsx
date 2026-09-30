import { useAtom, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  buildApplyRequest,
  cacheAtom,
  collapsedCachedIdsAtom,
  selectedCachedIdAtom,
} from '@/entities/cached-node';
import { dbTreeKeys } from '@/entities/db-node';
import { ApiError, treeApi } from '@/shared/api';
import { useNotify } from '@/shared/model';

export function ApplyChangesButton() {
  const [cache, setCache] = useAtom(cacheAtom);
  const setSelectedCachedId = useSetAtom(selectedCachedIdAtom);
  const setCollapsedCachedIds = useSetAtom(collapsedCachedIdsAtom);
  const queryClient = useQueryClient();
  const notify = useNotify();

  const request = buildApplyRequest(cache);
  const pendingCount = request.updates.length + request.creates.length + request.deletes.length;

  const { mutate, isPending } = useMutation({
    mutationFn: treeApi.apply,
    onSuccess: (result) => {
      setCache(RESET);
      setSelectedCachedId(null);
      setCollapsedCachedIds([]);
      void queryClient.invalidateQueries({ queryKey: dbTreeKeys.all });
      notify(
        `Applied: ${result.updated} updated, ${result.created} created, ${result.deleted} deleted`,
        'success',
      );
    },
    onError: (error) =>
      notify(
        error instanceof ApiError && error.status === 409
          ? `${error.message} Your changes are kept in the cache; use Reset to start over.`
          : error.message,
        'error',
      ),
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
