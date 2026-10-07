import { Box, ButtonBase, Divider, Typography } from '@mui/material';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import type { JobApplication } from '../../types/application';
import { formatDate } from '../../utils/date';
import CompanyAvatar from '../common/CompanyAvatar';
import ApplicationActions from './ApplicationActions';
import type { ApplicationActionHandlers } from './ApplicationActions';
import StatusChip from './StatusChip';

interface ApplicationCardListProps extends ApplicationActionHandlers {
  rows: JobApplication[];
}

/** Mobile-friendly alternative to the table: one compact block per application. */
export default function ApplicationCardList({ rows, onView, onEdit, onDelete }: ApplicationCardListProps) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }} aria-label="Job applications">
      {rows.map((application, index) => (
        <Box component="li" key={application._id}>
          {index > 0 && <Divider />}
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <ButtonBase
              onClick={() => onView(application)}
              sx={{ display: 'flex', width: '100%', textAlign: 'left', alignItems: 'flex-start', gap: 1.5, borderRadius: 2 }}
            >
              <CompanyAvatar name={application.companyName} size={40} />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'flex-start' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {application.companyName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {application.jobTitle}
                    </Typography>
                  </Box>
                  <StatusChip status={application.status} />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5, mt: 1, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PlaceOutlined sx={{ fontSize: 15 }} />
                    <Typography variant="caption">{application.location || 'No location'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayOutlined sx={{ fontSize: 13 }} />
                    <Typography variant="caption">Applied {formatDate(application.appliedDate)}</Typography>
                  </Box>
                </Box>
              </Box>
            </ButtonBase>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
              <ApplicationActions application={application} onView={onView} onEdit={onEdit} onDelete={onDelete} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
