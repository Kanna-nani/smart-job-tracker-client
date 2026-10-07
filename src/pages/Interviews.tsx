import { useMemo } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EventAvailableRounded from '@mui/icons-material/EventAvailableRounded';
import TodayRounded from '@mui/icons-material/TodayRounded';
import CodeRounded from '@mui/icons-material/CodeRounded';
import HandshakeOutlined from '@mui/icons-material/HandshakeOutlined';
import PageHeader from '../components/common/PageHeader';
import SummaryCard from '../components/dashboard/SummaryCard';
import InterviewStageBoard from '../components/interviews/InterviewStageBoard';
import UpcomingInterviews from '../components/interviews/UpcomingInterviews';
import { getStatusColor } from '../constants/status';
import { useApplicationDialogs } from '../hooks/useApplicationDialogs';
import { useApplications } from '../hooks/useApplications';
import { countByStatus, getUpcomingInterviews, isInterviewStage } from '../utils/analytics';
import { dayDifference } from '../utils/date';

export default function Interviews() {
  const { palette } = useTheme();
  const { applications, interviews } = useApplications();
  const { dialogs, openDetails } = useApplicationDialogs();

  const upcoming = useMemo(() => getUpcomingInterviews(interviews, applications), [interviews, applications]);
  const counts = useMemo(() => countByStatus(applications), [applications]);
  const inProgress = applications.filter((a) => isInterviewStage(a.status)).length;
  const thisWeek = upcoming.filter(({ interview }) => dayDifference(interview.scheduledAt) < 7).length;

  return (
    <>
      <PageHeader
        heading="Interview schedule"
        description="Prepare for what’s next and keep every interview stage moving."
      />

      <Grid container spacing={{ xs: 2, md: 2.5 }} sx={{ mb: { xs: 2, md: 2.5 } }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            label="In interview stages"
            value={inProgress}
            icon={EventAvailableRounded}
            color={palette.primary.main}
            helperText="Across all interview rounds"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            label="Next 7 days"
            value={thisWeek}
            icon={TodayRounded}
            color={getStatusColor('Interview', palette.mode)}
            helperText={`${upcoming.length} scheduled in total`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            label="Technical rounds"
            value={counts['Technical Round']}
            icon={CodeRounded}
            color={getStatusColor('Technical Round', palette.mode)}
            helperText="Coding, system design & take-homes"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            label="HR rounds"
            value={counts['HR Round']}
            icon={HandshakeOutlined}
            color={getStatusColor('HR Round', palette.mode)}
            helperText="Final conversations before an offer"
          />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <UpcomingInterviews
            items={upcoming}
            onSelect={openDetails}
            subtitle="Select an interview to view the application"
            showInterviewer
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <InterviewStageBoard applications={applications} onSelect={openDetails} />
        </Grid>
      </Grid>

      {dialogs}
    </>
  );
}
