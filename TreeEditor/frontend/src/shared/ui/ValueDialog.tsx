import { useState, type FormEvent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export const MAX_VALUE_LENGTH = 500;

interface ValueDialogProps {
  open: boolean;
  title: string;
  submitLabel: string;
  initialValue?: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

export function ValueDialog({ open, ...props }: ValueDialogProps) {
  return (
    <Dialog open={open} onClose={props.onClose} fullWidth maxWidth="xs">
      {open && <ValueForm {...props} />}
    </Dialog>
  );
}

function ValueForm({
  title,
  submitLabel,
  initialValue = '',
  onSubmit,
  onClose,
}: Omit<ValueDialogProps, 'open'>) {
  const [value, setValue] = useState(initialValue);
  const trimmed = value.trim();
  const error =
    trimmed.length === 0
      ? 'Value is required'
      : trimmed.length > MAX_VALUE_LENGTH
        ? `Max ${MAX_VALUE_LENGTH} characters`
        : null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (error) return;
    onSubmit(trimmed);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Value"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          error={value.length > 0 && error !== null}
          helperText={value.length > 0 ? error : ' '}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={error !== null}>
          {submitLabel}
        </Button>
      </DialogActions>
    </form>
  );
}
