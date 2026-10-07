import { useMemo, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { CHART_COLORS } from '../../constants/status';
import type { JobApplication } from '../../types/application';
import { getApplicationsOverTime } from '../../utils/analytics';
import type { TimeGranularity } from '../../utils/analytics';
import SectionCard from '../common/SectionCard';

interface ApplicationsOverTimeChartProps {
  applications: JobApplication[];
  defaultGranularity?: TimeGranularity;
  height?: number;
}

const PERIODS: Record<TimeGranularity, number> = { week: 12, month: 6 };
const Y_AXIS_WIDTH = 28;
const TICK_COUNT = 4;

export default function ApplicationsOverTimeChart({
  applications,
  defaultGranularity = 'week',
  height = 220,
}: ApplicationsOverTimeChartProps) {
  const theme = useTheme();
  const [granularity, setGranularity] = useState<TimeGranularity>(defaultGranularity);
  const buckets = useMemo(
    () => getApplicationsOverTime(applications, granularity, PERIODS[granularity]),
    [applications, granularity],
  );

  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const step = Math.max(1, Math.ceil(Math.max(...buckets.map((b) => b.count), 0) / TICK_COUNT));
  const scaleMax = step * TICK_COUNT;
  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => i * step);
  const barColor = CHART_COLORS.series[theme.palette.mode];
  const unit = granularity === 'week' ? 'weeks' : 'months';
  const average = (total / buckets.length).toFixed(1);

  return (
    <SectionCard
      title="Applications over time"
      subtitle={`${total} applications in the last ${PERIODS[granularity]} ${unit} · avg ${average} per ${granularity}`}
      action={
        <ToggleButtonGroup
          size="small"
          exclusive
          value={granularity}
          onChange={(_, value: TimeGranularity | null) => value && setGranularity(value)}
          aria-label="Time range"
        >
          <ToggleButton value="week">Weekly</ToggleButton>
          <ToggleButton value="month">Monthly</ToggleButton>
        </ToggleButtonGroup>
      }
    >
      <Box
        role="group"
        aria-label={`Bar chart of applications per ${granularity}`}
        sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {/* Grows to fill the card when a taller sibling stretches the row. */}
        <Box sx={{ display: 'flex', flex: 1, minHeight: height }}>
          {/* Y axis */}
          <Box sx={{ position: 'relative', width: Y_AXIS_WIDTH, flexShrink: 0 }} aria-hidden>
            {ticks.map((tick) => (
              <Typography
                key={tick}
                variant="caption"
                sx={{
                  position: 'absolute',
                  right: 8,
                  bottom: `${(tick / scaleMax) * 100}%`,
                  transform: 'translateY(50%)',
                  color: 'text.secondary',
                  lineHeight: 1,
                }}
              >
                {tick}
              </Typography>
            ))}
          </Box>

          {/* Plot */}
          <Box sx={{ position: 'relative', flexGrow: 1, borderBottom: 1, borderColor: 'divider' }}>
            {ticks.slice(1).map((tick) => (
              <Box
                key={tick}
                aria-hidden
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: `${(tick / scaleMax) * 100}%`,
                  borderTop: `1px dashed ${theme.palette.divider}`,
                }}
              />
            ))}
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'stretch' }}>
              {buckets.map((bucket) => (
                <Tooltip
                  key={bucket.key}
                  placement="top"
                  title={
                    <>
                      <Box component="span" sx={{ display: 'block', opacity: 0.8 }}>
                        {bucket.tooltipLabel}
                      </Box>
                      <strong>
                        {bucket.count} application{bucket.count === 1 ? '' : 's'}
                      </strong>
                    </>
                  }
                >
                  <Box
                    tabIndex={0}
                    aria-label={`${bucket.tooltipLabel}: ${bucket.count} applications`}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      borderRadius: 1,
                      outline: 'none',
                      cursor: 'default',
                      '&:hover, &:focus-visible': { bgcolor: alpha(barColor, 0.06) },
                      '&:hover .bar, &:focus-visible .bar': { filter: 'brightness(0.9)' },
                    }}
                  >
                    <Box
                      className="bar"
                      sx={{
                        width: '56%',
                        maxWidth: 36,
                        height: `${(bucket.count / scaleMax) * 100}%`,
                        bgcolor: barColor,
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 400ms ease, filter 150ms ease',
                      }}
                    />
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>

        {/* X axis */}
        <Box sx={{ display: 'flex', pl: `${Y_AXIS_WIDTH}px`, mt: 1 }} aria-hidden>
          {buckets.map((bucket, index) => (
            <Typography
              key={bucket.key}
              variant="caption"
              sx={{
                flex: '1 1 0',
                minWidth: 0,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                color: 'text.secondary',
                // Thin out dense weekly labels on narrow screens (keep the latest week labelled).
                visibility: {
                  xs: granularity === 'week' && (buckets.length - 1 - index) % 3 !== 0 ? 'hidden' : 'visible',
                  md: 'visible',
                },
              }}
            >
              {bucket.label}
            </Typography>
          ))}
        </Box>
      </Box>
    </SectionCard>
  );
}
