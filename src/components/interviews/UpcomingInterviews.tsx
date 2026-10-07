import type { ReactNode } from 'react';
import { Box, ButtonBase, Chip, Divider, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import VideocamOutlined from '@mui/icons-material/VideocamOutlined';
import ApartmentRounded from '@mui/icons-material/ApartmentRounded';
import PhoneInTalkOutlined from '@mui/icons-material/PhoneInTalkOutlined';
import EventBusyRounded from '@mui/icons-material/EventBusyRounded';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import type { InterviewMode, JobApplication, ScheduledInterview } from '../../types/application';
import type { IconComponent } from '../../types/ui';
import { dayDifference, formatRelative, formatTime } from '../../utils/date';
import EmptyState from '../common/EmptyState';
import SectionCard from '../common/SectionCard';

interface UpcomingInterviewsProps {
  items: ScheduledInterview[];
  onSelect: (application: JobApplication) => void;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  limit?: number;
  showInterviewer?: boolean;
}

const MODE_ICONS: Record<InterviewMode, IconComponent> = {
  Video: VideocamOutlined,
  Onsite: ApartmentRounded,
  Phone: PhoneInTalkOutlined,
};

const monthFormatter = new Intl.DateTimeFormat('en-GB', { month: 'short' });

function whenLabel(iso: string): string {
  const diff = dayDifference(iso);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  const label = formatRelative(iso);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function UpcomingInterviews({
  items,
  onSelect,
  title = 'Upcoming interviews',
  subtitle,
  action,
  limit,
  showInterviewer = false,
}: UpcomingInterviewsProps) {
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <SectionCard
      title={title}
      subtitle={subtitle ?? `${items.length} scheduled`}
      action={action}
      disablePadding
    >
      {visible.length === 0 ? (
        <EmptyState
          compact
          icon={EventBusyRounded}
          title="No interviews scheduled"
          description="Interviews you schedule will appear here."
        />
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, pb: 1 }}>
          {visible.map(({ interview, application }, index) => {
            const ModeIcon = MODE_ICONS[interview.mode];
            const date = new Date(interview.scheduledAt);
            const isToday = dayDifference(interview.scheduledAt) === 0;
            return (
              <Box component="li" key={interview._id}>
                {index > 0 && <Divider sx={{ mx: { xs: 2, sm: 2.5 } }} />}
                <ButtonBase
                  onClick={() => onSelect(application)}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.75,
                    px: { xs: 2, sm: 2.5 },
                    py: 1.5,
                    textAlign: 'left',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box
                    sx={(theme) => ({
                      width: 48,
                      flexShrink: 0,
                      borderRadius: 2,
                      textAlign: 'center',
                      py: 0.75,
                      border: 1,
                      borderColor: isToday ? alpha(theme.palette.primary.main, 0.4) : 'divider',
                      bgcolor: isToday ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    })}
                  >
                    <Typography
                      variant="overline"
                      sx={{ display: 'block', lineHeight: 1.2, color: isToday ? 'primary.main' : 'text.secondary' }}
                    >
                      {monthFormatter.format(date)}
                    </Typography>
                    <Typography variant="h6" component="span" sx={{ lineHeight: 1.2 }}>
                      {date.getDate()}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {application.companyName} · {interview.stage}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeRounded sx={{ fontSize: 15 }} />
                        <Typography variant="caption">
                          {formatTime(interview.scheduledAt)} · {interview.durationMinutes} min
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ModeIcon sx={{ fontSize: 15 }} />
                        <Typography variant="caption">{interview.mode}</Typography>
                      </Box>
                    </Box>
                    {showInterviewer && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
                        {interview.interviewer}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    size="small"
                    label={whenLabel(interview.scheduledAt)}
                    color={isToday ? 'primary' : 'default'}
                    variant={isToday ? 'filled' : 'outlined'}
                    sx={{ flexShrink: 0, display: { xs: isToday ? 'inline-flex' : 'none', sm: 'inline-flex' } }}
                  />
                </ButtonBase>
              </Box>
            );
          })}
        </Box>
      )}
    </SectionCard>
  );
}
