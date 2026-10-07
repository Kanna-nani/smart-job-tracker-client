import { Box, Tooltip, Typography } from '@mui/material';
import { percentage } from '../../utils/analytics';

export interface BarListItem {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface BarListProps {
  items: BarListItem[];
  /** Denominator for the percentage label (defaults to the sum of values). */
  total?: number;
  /** Value that fills the full track (defaults to the largest value). */
  max?: number;
  percentLabel?: string;
}

/**
 * Labelled horizontal bars. Each row names its category in text, so identity
 * never depends on colour alone; values and labels use text tokens.
 */
export default function BarList({ items, total, max, percentLabel = 'of total' }: BarListProps) {
  const sum = total ?? items.reduce((acc, item) => acc + item.value, 0);
  const fullScale = Math.max(max ?? Math.max(...items.map((item) => item.value), 0), 1);

  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1.75 }}>
      {items.map((item) => {
        const pct = percentage(item.value, sum);
        return (
          <Tooltip
            key={item.key}
            placement="top"
            title={`${item.label}: ${item.value} (${pct}% ${percentLabel})`}
            followCursor
          >
            <Box component="li" tabIndex={0} sx={{ outline: 'none', '&:focus-visible .bar-track': { outline: 2, outlineColor: 'primary.main', outlineOffset: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                  <Typography variant="body2" noWrap>
                    {item.label}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexShrink: 0 }}>
                  <Typography variant="subtitle2">{item.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 32, textAlign: 'right' }}>
                    {pct}%
                  </Typography>
                </Box>
              </Box>
              <Box className="bar-track" sx={{ height: 8, borderRadius: 1, bgcolor: 'action.hover', overflow: 'hidden' }}>
                <Box
                  sx={{
                    height: '100%',
                    width: `${(item.value / fullScale) * 100}%`,
                    minWidth: item.value > 0 ? 4 : 0,
                    bgcolor: item.color,
                    borderRadius: 1,
                    transition: 'width 400ms ease',
                  }}
                />
              </Box>
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}
