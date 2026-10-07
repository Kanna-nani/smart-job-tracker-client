import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Card, Divider, TablePagination, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddRounded from '@mui/icons-material/AddRounded';
import SearchOffRounded from '@mui/icons-material/SearchOffRounded';
import WorkOutlineRounded from '@mui/icons-material/WorkOutlineRounded';
import ApplicationCardList from '../components/applications/ApplicationCardList';
import ApplicationFilters from '../components/applications/ApplicationFilters';
import ApplicationTable from '../components/applications/ApplicationTable';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import { useApplicationDialogs } from '../hooks/useApplicationDialogs';
import { useApplications } from '../hooks/useApplications';
import { countByStatus } from '../utils/analytics';
import { filterApplications, sortApplications } from '../utils/applications';
import type { SortState, StatusFilter } from '../utils/applications';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export default function Applications() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const { applications, searchQuery, setSearchQuery } = useApplications();
  const { dialogs, openAdd, openEdit, openDetails, requestDelete } = useApplicationDialogs();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sort, setSort] = useState<SortState>({ field: 'appliedDate', direction: 'desc' });
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Page resets whenever the result set changes shape, without a sync effect.
  const filterKey = `${searchQuery}|${statusFilter}|${sort.field}-${sort.direction}|${rowsPerPage}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 0 });
  const requestedPage = pageState.key === filterKey ? pageState.page : 0;

  const statusCounts = useMemo(() => countByStatus(applications), [applications]);
  const results = useMemo(
    () => sortApplications(filterApplications(applications, searchQuery, statusFilter), sort),
    [applications, searchQuery, statusFilter, sort],
  );

  // Clamp in case deletions removed the last row on the current page.
  const lastPage = Math.max(0, Math.ceil(results.length / rowsPerPage) - 1);
  const page = Math.min(requestedPage, lastPage);
  const visibleRows = results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
  };

  const handlers = { onView: openDetails, onEdit: openEdit, onDelete: requestDelete };
  const hasApplications = applications.length > 0;

  return (
    <>
      <PageHeader
        heading="All applications"
        description="Search, filter and manage every role you’ve applied for."
        actions={
          <Button variant="contained" startIcon={<AddRounded />} onClick={openAdd} fullWidth={isMobile}>
            Add Application
          </Button>
        }
      />

      <Card>
        <ApplicationFilters
          search={searchQuery}
          onSearchChange={setSearchQuery}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          sort={sort}
          onSortChange={setSort}
          statusCounts={statusCounts}
          totalCount={applications.length}
          resultCount={results.length}
          onClear={clearFilters}
          autoFocusSearch={Boolean((location.state as { focusSearch?: boolean } | null)?.focusSearch)}
        />
        <Divider />

        {!hasApplications ? (
          <EmptyState
            icon={WorkOutlineRounded}
            title="No applications yet"
            description="Start tracking your job search by adding the first role you’ve applied for."
            action={
              <Button variant="contained" startIcon={<AddRounded />} onClick={openAdd}>
                Add Application
              </Button>
            }
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchOffRounded}
            title="No matching applications"
            description="Try a different search term or clear the filters to see everything."
            action={
              <Button variant="outlined" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            {isMobile ? (
              <ApplicationCardList rows={visibleRows} {...handlers} />
            ) : (
              <ApplicationTable rows={visibleRows} sort={sort} onSortChange={setSort} {...handlers} />
            )}
            <TablePagination
              component="div"
              count={results.length}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={isMobile ? [] : ROWS_PER_PAGE_OPTIONS}
              onPageChange={(_, next) => setPageState({ key: filterKey, page: next })}
              onRowsPerPageChange={(event) => setRowsPerPage(Number(event.target.value))}
              labelRowsPerPage="Rows per page"
            />
          </>
        )}
      </Card>

      {dialogs}
    </>
  );
}
