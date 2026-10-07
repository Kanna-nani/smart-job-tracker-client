import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import type { JobApplication } from '../../types/application';
import { formatDate, formatRelative } from '../../utils/date';
import { DEFAULT_SORT_DIRECTION } from '../../utils/applications';
import type { SortField, SortState } from '../../utils/applications';
import CompanyAvatar from '../common/CompanyAvatar';
import ApplicationActions from './ApplicationActions';
import type { ApplicationActionHandlers } from './ApplicationActions';
import StatusChip from './StatusChip';

interface ApplicationTableProps extends ApplicationActionHandlers {
  rows: JobApplication[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
}

interface Column {
  id: string;
  label: string;
  sortField?: SortField;
  align?: 'right';
  width?: number | string;
}

const COLUMNS: Column[] = [
  { id: 'company', label: 'Company', sortField: 'companyName', width: 185 },
  { id: 'title', label: 'Job Title', width: 185 },
  { id: 'status', label: 'Status', sortField: 'status', width: 168 },
  { id: 'location', label: 'Location', width: 148 },
  { id: 'applied', label: 'Applied Date', sortField: 'appliedDate', width: 132 },
  { id: 'actions', label: 'Actions', align: 'right', width: 132 },
];

export default function ApplicationTable({ rows, sort, onSortChange, onView, onEdit, onDelete }: ApplicationTableProps) {
  const handleSort = (field: SortField) => {
    onSortChange(
      sort.field === field
        ? { field, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: DEFAULT_SORT_DIRECTION[field] },
    );
  };

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 950, tableLayout: 'fixed' }} aria-label="Job applications">
        <TableHead>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                sx={{ width: column.width }}
                sortDirection={column.sortField && sort.field === column.sortField ? sort.direction : false}
              >
                {column.sortField ? (
                  <TableSortLabel
                    active={sort.field === column.sortField}
                    direction={sort.field === column.sortField ? sort.direction : DEFAULT_SORT_DIRECTION[column.sortField]}
                    onClick={() => handleSort(column.sortField!)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((application) => (
            <TableRow
              key={application._id}
              hover
              onClick={() => onView(application)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                  <CompanyAvatar name={application.companyName} />
                  <Typography variant="subtitle2" noWrap>
                    {application.companyName}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" noWrap title={application.jobTitle}>
                  {application.jobTitle}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusChip status={application.status} />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', minWidth: 0 }}>
                  <PlaceOutlined sx={{ fontSize: 16, flexShrink: 0 }} />
                  <Typography variant="body2" noWrap>
                    {application.location || '—'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{formatDate(application.appliedDate)}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatRelative(application.appliedDate)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <ApplicationActions application={application} onView={onView} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
