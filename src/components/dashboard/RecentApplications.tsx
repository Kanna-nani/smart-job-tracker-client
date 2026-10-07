import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, ButtonBase, Divider, Typography } from '@mui/material';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import type { JobApplication } from '../../types/application';
import { formatRelative } from '../../utils/date';
import CompanyAvatar from '../common/CompanyAvatar';
import EmptyState from '../common/EmptyState';
import SectionCard from '../common/SectionCard';
import StatusChip from '../applications/StatusChip';

interface RecentApplicationsProps {
  applications: JobApplication[];
  onSelect: (application: JobApplication) => void;
  limit?: number;
}

export default function RecentApplications({ applications, onSelect, limit = 6 }: RecentApplicationsProps) {
  const recent = useMemo(
    () => [...applications].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, limit),
    [applications, limit],
  );

  return (
    <SectionCard
      title="Recent activity"
      subtitle="Latest updates across your pipeline"
      disablePadding
      action={
        <Button component={RouterLink} to="/applications" size="small" endIcon={<ArrowForwardRounded fontSize="small" />}>
          View all
        </Button>
      }
    >
      {recent.length === 0 ? (
        <EmptyState compact title="No applications yet" description="Applications you add will show up here." />
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, pb: 1 }}>
          {recent.map((application, index) => (
            <Box component="li" key={application._id}>
              {index > 0 && <Divider sx={{ mx: { xs: 2, sm: 2.5 } }} />}
              <ButtonBase
                onClick={() => onSelect(application)}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: { xs: 2, sm: 2.5 },
                  py: 1.5,
                  textAlign: 'left',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <CompanyAvatar name={application.companyName} />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap>
                    {application.companyName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {application.jobTitle}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
                  <StatusChip status={application.status} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatRelative(application.updatedAt)}
                  </Typography>
                </Box>
              </ButtonBase>
            </Box>
          ))}
        </Box>
      )}
    </SectionCard>
  );
}
