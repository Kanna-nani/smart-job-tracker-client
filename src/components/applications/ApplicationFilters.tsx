import { Box, Button, IconButton, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchRounded from '@mui/icons-material/SearchRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import FilterAltOffOutlined from '@mui/icons-material/FilterAltOffOutlined';
import { getStatusColor } from '../../constants/status';
import { APPLICATION_STATUSES } from '../../types/application';
import type { ApplicationStatus } from '../../types/application';
import { SORT_OPTIONS, sortToValue } from '../../utils/applications';
import type { SortState, StatusFilter } from '../../utils/applications';

interface ApplicationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  sort: SortState;
  onSortChange: (value: SortState) => void;
  statusCounts: Record<ApplicationStatus, number>;
  totalCount: number;
  resultCount: number;
  onClear: () => void;
  autoFocusSearch?: boolean;
}

export default function ApplicationFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  statusCounts,
  totalCount,
  resultCount,
  onClear,
  autoFocusSearch,
}: ApplicationFiltersProps) {
  const { palette } = useTheme();
  const isFiltered = search.trim() !== '' || status !== 'All';

  return (
    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)' },
        }}
      >
        <TextField
          size="small"
          placeholder="Search company, role, location…"
          autoFocus={autoFocusSearch}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{ gridColumn: { sm: '1 / -1', md: 'auto' } }}
          slotProps={{
            htmlInput: { 'aria-label': 'Search applications' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" aria-label="Clear search" onClick={() => onSearchChange('')} edge="end">
                    <CloseRounded fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
          slotProps={{
            select: { renderValue: (value) => (value === 'All' ? 'All statuses' : String(value)) },
          }}
        >
          <MenuItem value="All">
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: 2 }}>
              All statuses
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {totalCount}
              </Typography>
            </Box>
          </MenuItem>
          {APPLICATION_STATUSES.map((value) => (
            <MenuItem key={value} value={value}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                <Box
                  component="span"
                  sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(value, palette.mode) }}
                />
                <Box component="span" sx={{ flexGrow: 1 }}>
                  {value}
                </Box>
                <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 2 }}>
                  {statusCounts[value]}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Sort by"
          value={sortToValue(sort)}
          onChange={(event) => {
            const option = SORT_OPTIONS.find((o) => o.value === event.target.value);
            if (option) onSortChange(option.sort);
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, minHeight: 30 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} aria-live="polite">
          {isFiltered
            ? `Showing ${resultCount} of ${totalCount} applications`
            : `${totalCount} applications`}
        </Typography>
        {isFiltered && (
          <Button size="small" color="inherit" startIcon={<FilterAltOffOutlined fontSize="small" />} onClick={onClear}>
            Clear filters
          </Button>
        )}
      </Box>
    </Box>
  );
}
