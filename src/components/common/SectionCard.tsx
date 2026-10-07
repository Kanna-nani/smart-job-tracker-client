import type { ReactNode } from 'react';
import { Box, Card, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

interface SectionCardProps {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  /** Remove body padding, e.g. for edge-to-edge lists. */
  disablePadding?: boolean;
  sx?: SxProps<Theme>;
}

export default function SectionCard({ title, subtitle, action, children, disablePadding, sx }: SectionCardProps) {
  return (
    <Card sx={[{ height: '100%', display: 'flex', flexDirection: 'column' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          px: { xs: 2, sm: 2.5 },
          pt: 2.5,
          pb: disablePadding ? 1.5 : 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" component="h2">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          ...(disablePadding ? {} : { px: { xs: 2, sm: 2.5 }, pb: 2.5 }),
        }}
      >
        {children}
      </Box>
    </Card>
  );
}
