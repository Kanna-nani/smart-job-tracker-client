import type { ReactNode } from 'react';
import { Box, Button, Divider, Drawer, IconButton, Link, Typography } from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import LinkRounded from '@mui/icons-material/LinkRounded';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import AddCircleOutline from '@mui/icons-material/AddCircleOutlineRounded';
import UpdateRounded from '@mui/icons-material/UpdateRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutlineRounded';
import NotesRounded from '@mui/icons-material/NotesRounded';
import type { JobApplication } from '../../types/application';
import type { IconComponent } from '../../types/ui';
import { formatDate, formatDateTime, formatRelative } from '../../utils/date';
import { getHostname } from '../../utils/applications';
import CompanyAvatar from '../common/CompanyAvatar';
import StatusChip from './StatusChip';

interface ApplicationDetailsProps {
  open: boolean;
  application: JobApplication | null;
  onClose: () => void;
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
}

function DetailRow({ icon: Icon, label, children }: { icon: IconComponent; label: string; children: ReactNode }) {
  return (
    <Box component="li" sx={{ display: 'flex', gap: 1.5, py: 1.25 }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          bgcolor: 'action.hover',
          color: 'text.secondary',
        }}
      >
        <Icon sx={{ fontSize: 18 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {label}
        </Typography>
        <Box sx={{ typography: 'body2', fontWeight: 500, wordBreak: 'break-word' }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default function ApplicationDetails({ open, application, onClose, onEdit, onDelete }: ApplicationDetailsProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-labelledby="application-details-title"
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 440 }, maxWidth: '100%' } } }}
    >
      {application && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Application details
            </Typography>
            <IconButton aria-label="Close details" onClick={onClose} size="small" edge="end">
              <CloseRounded fontSize="small" />
            </IconButton>
          </Box>
          <Divider />

          <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 3, py: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CompanyAvatar name={application.companyName} size={52} />
              <Box sx={{ minWidth: 0 }}>
                <Typography id="application-details-title" variant="h6" component="h2" sx={{ lineHeight: 1.3 }}>
                  {application.jobTitle}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {application.companyName}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <StatusChip status={application.status} size="medium" />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Updated {formatRelative(application.updatedAt)}
              </Typography>
            </Box>

            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2.5 }}>
              <DetailRow icon={PlaceOutlined} label="Location">
                {application.location || 'Not specified'}
              </DetailRow>
              <DetailRow icon={LinkRounded} label="Job URL">
                {application.jobUrl ? (
                  <Link
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}
                  >
                    {getHostname(application.jobUrl)}
                    <OpenInNewRounded sx={{ fontSize: 14 }} />
                  </Link>
                ) : (
                  'Not provided'
                )}
              </DetailRow>
              <DetailRow icon={CalendarTodayOutlined} label="Applied date">
                {formatDate(application.appliedDate)}
              </DetailRow>
              <DetailRow icon={AddCircleOutline} label="Created">
                {formatDateTime(application.createdAt)}
              </DetailRow>
              <DetailRow icon={UpdateRounded} label="Last updated">
                {formatDateTime(application.updatedAt)}
              </DetailRow>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
                <NotesRounded sx={{ fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  Notes
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-wrap', color: application.notes ? 'text.primary' : 'text.secondary' }}
                >
                  {application.notes || 'No notes yet. Add interview prep, contacts or salary details.'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />
          <Box sx={{ display: 'flex', gap: 1.5, px: 3, py: 2 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutline />}
              onClick={() => onDelete(application)}
              sx={{ flex: 1 }}
            >
              Delete
            </Button>
            <Button variant="contained" startIcon={<EditOutlined />} onClick={() => onEdit(application)} sx={{ flex: 1 }}>
              Edit
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
