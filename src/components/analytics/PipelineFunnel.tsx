import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { CHART_COLORS } from '../../constants/status';
import type { JobApplication } from '../../types/application';
import { getConversionStats } from '../../utils/analytics';
import SectionCard from '../common/SectionCard';
import BarList from './BarList';

interface PipelineFunnelProps {
  applications: JobApplication[];
}

/** Ordered stages share one hue (an ordinal ramp) — they are steps, not categories. */
export default function PipelineFunnel({ applications }: PipelineFunnelProps) {
  const { palette } = useTheme();
  const stats = useMemo(() => getConversionStats(applications), [applications]);
  const ramp = CHART_COLORS.ordinal[palette.mode];

  const items = [
    { key: 'applied', label: 'Applications sent', value: stats.total, color: ramp[0] },
    { key: 'responded', label: 'Heard back', value: stats.responded, color: ramp[1] },
    { key: 'interviewed', label: 'Reached interviews', value: stats.interviewed, color: ramp[2] },
    { key: 'offers', label: 'Offers', value: stats.offers, color: ramp[3] },
  ];

  return (
    <SectionCard title="Pipeline funnel" subtitle="How applications progress from sent to offer">
      <BarList items={items} total={stats.total} max={stats.total} percentLabel="of applications sent" />
    </SectionCard>
  );
}
