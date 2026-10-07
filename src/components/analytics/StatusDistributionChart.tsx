import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { getStatusColor } from '../../constants/status';
import { APPLICATION_STATUSES } from '../../types/application';
import type { JobApplication } from '../../types/application';
import { countByStatus } from '../../utils/analytics';
import SectionCard from '../common/SectionCard';
import BarList from './BarList';

interface StatusDistributionChartProps {
  applications: JobApplication[];
}

export default function StatusDistributionChart({ applications }: StatusDistributionChartProps) {
  const { palette } = useTheme();
  const items = useMemo(() => {
    const counts = countByStatus(applications);
    return APPLICATION_STATUSES.map((status) => ({
      key: status,
      label: status,
      value: counts[status],
      color: getStatusColor(status, palette.mode),
    }));
  }, [applications, palette.mode]);

  return (
    <SectionCard title="Applications by status" subtitle={`Current stage of all ${applications.length} applications`}>
      <BarList items={items} total={applications.length} percentLabel="of applications" />
    </SectionCard>
  );
}
