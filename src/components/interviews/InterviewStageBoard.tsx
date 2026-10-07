import { Box, ButtonBase, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getStatusColor, INTERVIEW_STAGES } from '../../constants/status';
import type { JobApplication } from '../../types/application';
import { formatRelative } from '../../utils/date';
import CompanyAvatar from '../common/CompanyAvatar';
import SectionCard from '../common/SectionCard';

interface InterviewStageBoardProps {
  applications: JobApplication[];
  onSelect: (application: JobApplication) => void;
}

/** Kanban-style columns for each interview stage; stacks on small screens. */
export default function InterviewStageBoard({ applications, onSelect }: InterviewStageBoardProps) {
  const { palette } = useTheme();

  return (
    <SectionCard title="Interview pipeline" subtitle="Applications currently in an interview stage">
      <Grid container spacing={1.5}>
        {INTERVIEW_STAGES.map((stage) => {
          const items = applications
            .filter((a) => a.status === stage)
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
          return (
            <Grid key={stage} size={{ xs: 12, sm: 4 }} sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: 'action.hover',
                  p: 1.25,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 0.5, pb: 1.25 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(stage, palette.mode) }} />
                  <Typography variant="subtitle2" sx={{ flexGrow: 1 }} noWrap>
                    {stage}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {items.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 1 }}>
                  {items.length === 0 && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', px: 0.5, py: 1.5 }}>
                      Nothing in this stage
                    </Typography>
                  )}
                  {items.map((application) => (
                    <ButtonBase
                      key={application._id}
                      onClick={() => onSelect(application)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        width: '100%',
                        minWidth: 0,
                        p: 1.25,
                        textAlign: 'left',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        transition: 'border-color 150ms ease, box-shadow 150ms ease',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                    >
                      <CompanyAvatar name={application.companyName} size={32} />
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {application.companyName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
                          {application.jobTitle}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Updated {formatRelative(application.updatedAt)}
                        </Typography>
                      </Box>
                    </ButtonBase>
                  ))}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </SectionCard>
  );
}
