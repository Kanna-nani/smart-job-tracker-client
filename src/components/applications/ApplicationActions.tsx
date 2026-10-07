import { Box, IconButton, Tooltip } from '@mui/material';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutlineRounded';
import type { JobApplication } from '../../types/application';

export interface ApplicationActionHandlers {
  onView: (application: JobApplication) => void;
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
}

interface ApplicationActionsProps extends ApplicationActionHandlers {
  application: JobApplication;
}

/** View / Edit / Delete icon buttons shared by the table and the mobile card list. */
export default function ApplicationActions({ application, onView, onEdit, onDelete }: ApplicationActionsProps) {
  const label = `${application.companyName} — ${application.jobTitle}`;

  return (
    <Box sx={{ display: 'inline-flex', gap: 0.25 }} onClick={(event) => event.stopPropagation()}>
      <Tooltip title="View details">
        <IconButton size="small" aria-label={`View ${label}`} onClick={() => onView(application)}>
          <VisibilityOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton size="small" aria-label={`Edit ${label}`} onClick={() => onEdit(application)}>
          <EditOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          aria-label={`Delete ${label}`}
          onClick={() => onDelete(application)}
          sx={{ '&:hover': { color: 'error.main' } }}
        >
          <DeleteOutline fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
