import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Grid } from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import ApplicationsOverTimeChart from '../components/analytics/ApplicationsOverTimeChart';
import StatusDistributionChart from '../components/analytics/StatusDistributionChart';
import PageHeader from '../components/common/PageHeader';
import ApplicationOverview from '../components/dashboard/ApplicationOverview';
import ConversionSummary from '../components/dashboard/ConversionSummary';
import RecentApplications from '../components/dashboard/RecentApplications';
import UpcomingInterviews from '../components/interviews/UpcomingInterviews';
import { MOCK_USER } from '../data/mockUser';
import { useApplicationDialogs } from '../hooks/useApplicationDialogs';
import { useApplications } from '../hooks/useApplications';
import { getUpcomingInterviews } from '../utils/analytics';
import { getGreeting } from '../utils/date';

export default function Dashboard() {
  const { applications, interviews } = useApplications();
  const { dialogs, openAdd, openDetails } = useApplicationDialogs();

  const upcoming = useMemo(() => getUpcomingInterviews(interviews, applications), [interviews, applications]);
  const firstName = MOCK_USER.name.split(' ')[0];

  return (
    <>
      <PageHeader
        heading={`${getGreeting()}, ${firstName}`}
        description={
          upcoming.length > 0
            ? `You have ${upcoming.length} upcoming interview${upcoming.length === 1 ? '' : 's'}. Here’s how your search is going.`
            : 'Here’s how your job search is going.'
        }
        actions={
          <Button variant="contained" startIcon={<AddRounded />} onClick={openAdd}>
            Add Application
          </Button>
        }
      />

      <Box sx={{ display: 'grid', gap: { xs: 2, md: 2.5 } }}>
        <ApplicationOverview applications={applications} />

        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <ApplicationsOverTimeChart applications={applications} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <StatusDistributionChart applications={applications} />
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <RecentApplications applications={applications} onSelect={openDetails} />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }} sx={{ display: 'grid', gap: { xs: 2, md: 2.5 }, alignContent: 'start' }}>
            <ConversionSummary applications={applications} />
            <UpcomingInterviews
              items={upcoming}
              limit={4}
              onSelect={openDetails}
              action={
                <Button component={RouterLink} to="/interviews" size="small" endIcon={<ArrowForwardRounded fontSize="small" />}>
                  Schedule
                </Button>
              }
            />
          </Grid>
        </Grid>
      </Box>

      {dialogs}
    </>
  );
}
