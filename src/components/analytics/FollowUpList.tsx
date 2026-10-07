import { useMemo } from 'react';
import { Box, ButtonBase, Divider, Typography } from '@mui/material';
import TaskAltRounded from '@mui/icons-material/TaskAltRounded';
import type { JobApplication } from '../../types/application';
import { getStaleApplications } from '../../utils/analytics';
import { formatRelative } from '../../utils/date';
import CompanyAvatar from '../common/CompanyAvatar';
import EmptyState from '../common/EmptyState';
import SectionCard from '../common/SectionCard';

interface FollowUpListProps {
  applications: JobApplication[];
  onSelect: (application: JobApplication) => void;
  limit?: number;
}

export default function FollowUpList({ applications, onSelect, limit = 5 }: FollowUpListProps) {
  const stale = useMemo(() => getStaleApplications(applications), [applications]);

  return (
    <SectionCard
      title="Needs follow-up"
      subtitle={`${stale.length} application${stale.length === 1 ? '' : 's'} with no response in 3+ weeks`}
      disablePadding
    >
      {stale.length === 0 ? (
        <EmptyState compact icon={TaskAltRounded} title="All caught up" description="No applications are waiting on a follow-up." />
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, pb: 1 }}>
          {stale.slice(0, limit).map((application, index) => (
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
                  py: 1.25,
                  textAlign: 'left',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <CompanyAvatar name={application.companyName} size={32} />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap>
                    {application.companyName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
                    {application.jobTitle}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                  Applied {formatRelative(application.appliedDate)}
                </Typography>
              </ButtonBase>
            </Box>
          ))}
        </Box>
      )}
    </SectionCard>
  );
}
