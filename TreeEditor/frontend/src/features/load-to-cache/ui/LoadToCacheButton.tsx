import { useAtomValue, useSetAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { cacheAtom, loadNode, selectedCachedIdAtom } from '@/entities/cached-node';
import { findLoadedDbNode, selectedDbIdAtom } from '@/entities/db-node';
import { useNotify } from '@/shared/model';

export function LoadToCacheButton() {
  const queryClient = useQueryClient();
  const selectedDbId = useAtomValue(selectedDbIdAtom);
  const setCache = useSetAtom(cacheAtom);
  const setSelectedCachedId = useSetAtom(selectedCachedIdAtom);
  const notify = useNotify();

  const handleLoad = () => {
    if (!selectedDbId) return;

    const loaded = findLoadedDbNode(queryClient, selectedDbId);
    if (!loaded) {
      notify('The selected node is no longer available', 'error');
      return;
    }

    setCache((cache) => loadNode(cache, loaded.node, loaded.ancestorIds));
    setSelectedCachedId(loaded.node.id);
  };

  return (
    <Button
      variant="contained"
      size="small"
      endIcon={<ArrowForwardIcon />}
      disabled={!selectedDbId}
      onClick={handleLoad}
    >
      Load
    </Button>
  );
}
