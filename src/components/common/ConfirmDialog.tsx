import type { ReactNode } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  destructive,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const color = destructive ? 'error' : 'primary';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="confirm-dialog-title">
      <DialogContent sx={{ pt: 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box
          sx={(theme) => ({
            flexShrink: 0,
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            color: `${color}.main`,
            bgcolor: alpha(theme.palette[color].main, 0.12),
          })}
        >
          <WarningAmberRounded fontSize="small" />
        </Box>
        <Box>
          <Typography id="confirm-dialog-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" component="div" sx={{ color: 'text.secondary', mt: 0.75 }}>
            {description}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color={color} autoFocus>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
