import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import InboxRounded from '@mui/icons-material/InboxRounded';
import type { IconComponent } from '../../types/ui';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconComponent;
  action?: ReactNode;
  compact?: boolean;
}

export default function EmptyState({ title, description, icon: Icon = InboxRounded, action, compact }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        py: compact ? 4 : 8,
        px: 3,
      }}
    >
      <Box
        sx={(theme) => ({
          width: compact ? 44 : 56,
          height: compact ? 44 : 56,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          mb: 2,
          color: 'primary.main',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
        })}
      >
        <Icon fontSize={compact ? 'small' : 'medium'} />
      </Box>
      <Typography variant="subtitle1" component="p">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, maxWidth: 360 }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 2.5 }}>{action}</Box>}
    </Box>
  );
}
