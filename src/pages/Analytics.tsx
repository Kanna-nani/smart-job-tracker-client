import { useMemo } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MarkEmailReadOutlined from '@mui/icons-material/MarkEmailReadOutlined';
import ForumOutlined from '@mui/icons-material/ForumOutlined';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';
import ApplicationsOverTimeChart from '../components/analytics/ApplicationsOverTimeChart';
import BarList from '../components/analytics/BarList';
import ConversionCard from '../components/analytics/ConversionCard';
import FollowUpList from '../components/analytics/FollowUpList';
import PipelineFunnel from '../components/analytics/PipelineFunnel';
import StatusDistributionChart from '../components/analytics/StatusDistributionChart';
import PageHeader from '../components/common/PageHeader';
import SectionCard from '../components/common/SectionCard';
import { CHART_COLORS } from '../constants/status';
import { useApplicationDialogs } from '../hooks/useApplicationDialogs';
import { useApplications } from '../hooks/useApplications';
import { countLocations, getConversionStats } from '../utils/analytics';

export default function Analytics() {
  const { palette } = useTheme();
  const { applications } = useApplications();
  const { dialogs, openDetails } = useApplicationDialogs();
  const stats = useMemo(() => getConversionStats(applications), [applications]);
  const locations = useMemo(
    () =>
      countLocations(applications).map(({ label, count }) => ({
        key: label,
        label,
        value: count,
        color: CHART_COLORS.series[palette.mode],
      })),
    [applications, palette.mode],
  );

  return (
    <>
      <PageHeader
        heading="Job search insights"
        description="Understand where your applications convert and where they stall."
      />

      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <ConversionCard
            title="Response rate"
            rate={stats.responseRate}
            numerator={stats.responded}
            denominator={stats.total}
            caption="applications got a response"
            icon={MarkEmailReadOutlined}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <ConversionCard
            title="Interview conversion"
            rate={stats.interviewRate}
            numerator={stats.interviewed}
            denominator={stats.total}
            caption="applications reached interviews"
            icon={ForumOutlined}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <ConversionCard
            title="Offer conversion"
            rate={stats.offerRate}
            numerator={stats.offers}
            denominator={stats.interviewed}
            caption="interviewed roles became offers"
            icon={EmojiEventsOutlined}
          />
        </Grid>

        <Grid size={12}>
          <ApplicationsOverTimeChart applications={applications} defaultGranularity="month" height={260} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <StatusDistributionChart applications={applications} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PipelineFunnel applications={applications} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="Top locations" subtitle="Where you’re applying most">
            <BarList items={locations} total={applications.length} percentLabel="of applications" />
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FollowUpList applications={applications} onSelect={openDetails} />
        </Grid>
      </Grid>

      {dialogs}
    </>
  );
}
