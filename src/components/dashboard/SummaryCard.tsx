import { Box, Card, CardContent, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRounded from '@mui/icons-material/TrendingDownRounded';
import TrendingFlatRounded from '@mui/icons-material/TrendingFlatRounded';
import type { IconComponent } from '../../types/ui';

export interface SummaryTrend {
  delta: number;
  caption: string;
  /** For metrics like "Rejected", an increase is bad news. */
  positiveIsGood?: boolean;
}

interface SummaryCardProps {
  label: string;
  value: number | string;
  icon: IconComponent;
  /** Accent for the icon tile only — text stays in text tokens. */
  color: string;
  trend?: SummaryTrend;
  helperText?: string;
}

function TrendIndicator({ delta, caption, positiveIsGood = true }: SummaryTrend) {
  const isFlat = delta === 0;
  const isGood = delta > 0 === positiveIsGood;
  const color = isFlat ? 'text.secondary' : isGood ? 'success.main' : 'error.main';
  const Icon = isFlat ? TrendingFlatRounded : delta > 0 ? TrendingUpRounded : TrendingDownRounded;
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : '';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
      <Box
        sx={(theme) => ({
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.25,
          px: 0.75,
          py: 0.125,
          borderRadius: 1,
          color,
          bgcolor: isFlat
            ? 'action.hover'
            : alpha(isGood ? theme.palette.success.main : theme.palette.error.main, 0.1),
        })}
      >
        <Icon sx={{ fontSize: 16 }} />
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {sign}
          {Math.abs(delta)}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {caption}
      </Typography>
    </Box>
  );
}

export default function SummaryCard({ label, value, icon: Icon, color, trend, helperText }: SummaryCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Label gets the full width so longer labels don't wrap and misalign the row of cards. */}
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }} noWrap>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 1, mb: 1.5 }}>
          <Typography variant="h4" component="p">
            {value}
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              color,
              bgcolor: alpha(color, 0.12),
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
        </Box>
        <Box sx={{ mt: 'auto' }}>
          {trend ? (
            <TrendIndicator {...trend} />
          ) : (
            helperText && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {helperText}
              </Typography>
            )
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
