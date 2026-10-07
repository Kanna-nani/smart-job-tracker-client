import { Box, Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { getStatusColor, getStatusTextColor } from '../../constants/status';
import type { ApplicationStatus } from '../../types/application';

interface StatusChipProps {
  status: ApplicationStatus;
  size?: 'small' | 'medium';
}

/** Tinted chip + status dot; the label always carries the meaning, never colour alone. */
export default function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const { palette } = useTheme();
  const color = getStatusColor(status, palette.mode);

  return (
    <Chip
      size={size}
      label={status}
      icon={
        <Box
          component="span"
          sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color, flexShrink: 0 }}
        />
      }
      sx={{
        color: getStatusTextColor(status, palette.mode),
        bgcolor: alpha(color, palette.mode === 'light' ? 0.12 : 0.2),
        border: `1px solid ${alpha(color, palette.mode === 'light' ? 0.22 : 0.32)}`,
        '& .MuiChip-icon': { ml: 1, mr: -0.25 },
        whiteSpace: 'nowrap',
      }}
    />
  );
}
