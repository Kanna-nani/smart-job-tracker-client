import { APPLICATION_STATUSES } from '../types/application';
import type { ApplicationStatus, JobApplication } from '../types/application';

export type StatusFilter = ApplicationStatus | 'All';
export type SortField = 'appliedDate' | 'companyName' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export const SORT_OPTIONS: { value: string; label: string; sort: SortState }[] = [
  { value: 'appliedDate-desc', label: 'Newest first', sort: { field: 'appliedDate', direction: 'desc' } },
  { value: 'appliedDate-asc', label: 'Oldest first', sort: { field: 'appliedDate', direction: 'asc' } },
  { value: 'companyName-asc', label: 'Company A–Z', sort: { field: 'companyName', direction: 'asc' } },
  { value: 'companyName-desc', label: 'Company Z–A', sort: { field: 'companyName', direction: 'desc' } },
  { value: 'status-asc', label: 'Status: pipeline order', sort: { field: 'status', direction: 'asc' } },
  { value: 'status-desc', label: 'Status: reverse order', sort: { field: 'status', direction: 'desc' } },
];

export const sortToValue = (sort: SortState): string => `${sort.field}-${sort.direction}`;

/** Default direction when a column header is first clicked. */
export const DEFAULT_SORT_DIRECTION: Record<SortField, SortDirection> = {
  appliedDate: 'desc',
  companyName: 'asc',
  status: 'asc',
};

export function filterApplications(
  applications: JobApplication[],
  search: string,
  status: StatusFilter,
): JobApplication[] {
  const query = search.trim().toLowerCase();
  return applications.filter((application) => {
    if (status !== 'All' && application.status !== status) return false;
    if (!query) return true;
    return [application.companyName, application.jobTitle, application.location, application.status, application.notes]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(query));
  });
}

export function sortApplications(applications: JobApplication[], { field, direction }: SortState): JobApplication[] {
  const factor = direction === 'asc' ? 1 : -1;
  return [...applications].sort((a, b) => {
    let result: number;
    if (field === 'status') {
      result = APPLICATION_STATUSES.indexOf(a.status) - APPLICATION_STATUSES.indexOf(b.status);
    } else if (field === 'companyName') {
      result = a.companyName.localeCompare(b.companyName);
    } else {
      result = a.appliedDate.localeCompare(b.appliedDate);
    }
    // Stable, predictable tiebreak: most recently applied first.
    return result * factor || b.appliedDate.localeCompare(a.appliedDate);
  });
}

export const getHostname = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
