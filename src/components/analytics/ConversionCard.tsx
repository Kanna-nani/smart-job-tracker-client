import { Box, Card, CardContent, LinearProgress, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { IconComponent } from '../../types/ui';

export interface ConversionMetricProps {
  title: string;
  rate: number;
  numerator: number;
  denominator: number;
  /** Completes the sentence "{numerator} of {denominator} …". */
  caption: string;
  icon: IconComponent;
}

/** Rate, progress bar and plain-language caption — usable on its own or inside a card. */
export function ConversionMetric({ title, rate, numerator, denominator, caption, icon: Icon }: ConversionMetricProps) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }} noWrap>
          {title}
        </Typography>
        <Box
          sx={(theme) => ({
            width: 32,
            height: 32,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            color: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          })}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      <Typography variant="h4" component="p" sx={{ mt: 0.5 }}>
        {rate}%
      </Typography>
      <LinearProgress variant="determinate" value={rate} aria-label={`${title}: ${rate}%`} sx={{ mt: 1.5, mb: 1 }} />
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {numerator} of {denominator} {caption}
      </Typography>
    </Box>
  );
}

export default function ConversionCard(props: ConversionMetricProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <ConversionMetric {...props} />
      </CardContent>
    </Card>
  );
}
