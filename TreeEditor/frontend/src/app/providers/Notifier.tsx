import { useAtom } from 'jotai';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { notificationAtom } from '@/shared/model';

export function Notifier() {
  const [notification, setNotification] = useAtom(notificationAtom);
  const close = () => setNotification(null);

  return (
    <Snackbar
      key={notification?.id}
      open={notification !== null}
      autoHideDuration={5000}
      onClose={(_, reason) => reason !== 'clickaway' && close()}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity={notification?.severity} variant="filled" onClose={close}>
        {notification?.message}
      </Alert>
    </Snackbar>
  );
}
