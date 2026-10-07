import { useMemo } from 'react';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WorkOutlineRounded from '@mui/icons-material/WorkOutlineRounded';
import SendRounded from '@mui/icons-material/SendRounded';
import EventAvailableRounded from '@mui/icons-material/EventAvailableRounded';
import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import DoNotDisturbOnOutlined from '@mui/icons-material/DoNotDisturbOnOutlined';
import { getStatusColor } from '../../constants/status';
import type { JobApplication } from '../../types/application';
import { getWindowDelta, isInterviewStage } from '../../utils/analytics';
import type { IconComponent } from '../../types/ui';
import SummaryCard from './SummaryCard';
import type { SummaryTrend } from './SummaryCard';

interface ApplicationOverviewProps {
  applications: JobApplication[];
}

interface CardConfig {
  label: string;
  value: number;
  icon: IconComponent;
  color: string;
  trend: SummaryTrend;
}

const TREND_CAPTION = 'vs prev. 30 days';

export default function ApplicationOverview({ applications }: ApplicationOverviewProps) {
  const { palette } = useTheme();

  const cards = useMemo<CardConfig[]>(() => {
    const count = (predicate: (a: JobApplication) => boolean) => applications.filter(predicate).length;
    const trend = (
      predicate: (a: JobApplication) => boolean,
      dateKey: 'appliedDate' | 'updatedAt',
      positiveIsGood = true,
    ): SummaryTrend => ({
      delta: getWindowDelta(applications, predicate, dateKey).delta,
      caption: TREND_CAPTION,
      positiveIsGood,
    });

    const all = () => true;
    const applied = (a: JobApplication) => a.status === 'Applied';
    const interviewing = (a: JobApplication) => isInterviewStage(a.status);
    const offers = (a: JobApplication) => a.status === 'Offer';
    const rejected = (a: JobApplication) => a.status === 'Rejected';

    return [
      {
        label: 'Total Applications',
        value: applications.length,
        icon: WorkOutlineRounded,
        color: palette.primary.main,
        trend: trend(all, 'appliedDate'),
      },
      {
        label: 'Applied',
        value: count(applied),
        icon: SendRounded,
        color: getStatusColor('Applied', palette.mode),
        trend: trend(applied, 'appliedDate'),
      },
      {
        label: 'Interviews',
        value: count(interviewing),
        icon: EventAvailableRounded,
        color: getStatusColor('Interview', palette.mode),
        trend: trend(interviewing, 'updatedAt'),
      },
      {
        label: 'Offers',
        value: count(offers),
        icon: EmojiEventsRounded,
        color: getStatusColor('Offer', palette.mode),
        trend: trend(offers, 'updatedAt'),
      },
      {
        label: 'Rejected',
        value: count(rejected),
        icon: DoNotDisturbOnOutlined,
        color: getStatusColor('Rejected', palette.mode),
        trend: trend(rejected, 'updatedAt', false),
      },
    ];
  }, [applications, palette.mode, palette.primary.main]);

  return (
    <Grid container spacing={{ xs: 2, md: 2.5 }} columns={{ xs: 1, sm: 2, md: 6, lg: 5 }}>
      {cards.map((card, index) => (
        <Grid
          key={card.label}
          // md: 3 + 2 layout — first row of three, second row of two wider cards.
          size={{ xs: 1, sm: index === 0 ? 2 : 1, md: index < 3 ? 2 : 3, lg: 1 }}
        >
          <SummaryCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}
