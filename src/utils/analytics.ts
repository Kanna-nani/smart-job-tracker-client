import { INTERVIEW_STAGES } from '../constants/status';
import { APPLICATION_STATUSES } from '../types/application';
import type {
  ApplicationStatus,
  Interview,
  JobApplication,
  ScheduledInterview,
} from '../types/application';
import { startOfMonth, startOfWeek } from './date';

const DAY_MS = 86_400_000;

export const isInterviewStage = (status: ApplicationStatus): boolean => INTERVIEW_STAGES.includes(status);

/** Offers imply the candidate passed through interviews. */
export const hasReachedInterview = (status: ApplicationStatus): boolean =>
  isInterviewStage(status) || status === 'Offer';

export const percentage = (part: number, whole: number): number =>
  whole === 0 ? 0 : Math.round((part / whole) * 100);

export function countByStatus(applications: JobApplication[]): Record<ApplicationStatus, number> {
  const counts = Object.fromEntries(APPLICATION_STATUSES.map((status) => [status, 0])) as Record<
    ApplicationStatus,
    number
  >;
  applications.forEach((application) => {
    counts[application.status] += 1;
  });
  return counts;
}

export interface ConversionStats {
  total: number;
  responded: number;
  interviewed: number;
  offers: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
}

export function getConversionStats(applications: JobApplication[]): ConversionStats {
  const total = applications.length;
  const responded = applications.filter((a) => a.status !== 'Applied' && a.status !== 'Withdrawn').length;
  const interviewed = applications.filter((a) => hasReachedInterview(a.status)).length;
  const offers = applications.filter((a) => a.status === 'Offer').length;

  return {
    total,
    responded,
    interviewed,
    offers,
    responseRate: percentage(responded, total),
    interviewRate: percentage(interviewed, total),
    offerRate: percentage(offers, interviewed),
  };
}

export type TimeGranularity = 'week' | 'month';

export interface TimeBucket {
  key: string;
  label: string;
  tooltipLabel: string;
  count: number;
}

const shortDay = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
const shortMonth = new Intl.DateTimeFormat('en-GB', { month: 'short' });
const longMonth = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

export function getApplicationsOverTime(
  applications: JobApplication[],
  granularity: TimeGranularity,
  periods: number,
  now = new Date(),
): TimeBucket[] {
  const anchor = granularity === 'week' ? startOfWeek(now) : startOfMonth(now);
  const appliedTimes = applications.map((a) => new Date(a.appliedDate).getTime());
  const buckets: TimeBucket[] = [];

  for (let i = periods - 1; i >= 0; i -= 1) {
    let start: Date;
    let end: Date;
    if (granularity === 'week') {
      start = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - 7 * i);
      end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
    } else {
      start = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    }

    const count = appliedTimes.filter((t) => t >= start.getTime() && t < end.getTime()).length;
    buckets.push({
      key: start.toISOString(),
      label: granularity === 'week' ? shortDay.format(start) : shortMonth.format(start),
      tooltipLabel: granularity === 'week' ? `Week of ${shortDay.format(start)}` : longMonth.format(start),
      count,
    });
  }

  return buckets;
}

export interface WindowDelta {
  current: number;
  previous: number;
  delta: number;
}

/** Compares matching applications in the last `days` against the window before it. */
export function getWindowDelta(
  applications: JobApplication[],
  predicate: (application: JobApplication) => boolean,
  dateKey: 'appliedDate' | 'updatedAt',
  days = 30,
  now = new Date(),
): WindowDelta {
  const nowMs = now.getTime();
  const windowMs = days * DAY_MS;
  let current = 0;
  let previous = 0;

  applications.filter(predicate).forEach((application) => {
    const age = nowMs - new Date(application[dateKey]).getTime();
    if (age >= 0 && age < windowMs) current += 1;
    else if (age >= windowMs && age < windowMs * 2) previous += 1;
  });

  return { current, previous, delta: current - previous };
}

export function countAppliedWithin(applications: JobApplication[], days: number, now = new Date()): number {
  const cutoff = now.getTime() - days * DAY_MS;
  return applications.filter((a) => new Date(a.appliedDate).getTime() >= cutoff).length;
}

/** Still "Applied" with no update for `days` or more — worth a follow-up. Oldest first. */
export function getStaleApplications(applications: JobApplication[], days = 21, now = new Date()): JobApplication[] {
  const cutoff = now.getTime() - days * DAY_MS;
  return applications
    .filter((a) => a.status === 'Applied' && new Date(a.updatedAt).getTime() <= cutoff)
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
}

export function countLocations(applications: JobApplication[], limit = 6): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  applications.forEach((application) => {
    const location = application.location?.trim() || 'Not specified';
    counts.set(location, (counts.get(location) ?? 0) + 1);
  });
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

/** Interviews joined with their application, upcoming first. Includes ones that started within the last hour. */
export function getUpcomingInterviews(
  interviews: Interview[],
  applications: JobApplication[],
  now = new Date(),
): ScheduledInterview[] {
  const byId = new Map(applications.map((a) => [a._id, a]));
  const cutoff = now.getTime() - 60 * 60 * 1000;

  return interviews
    .filter((interview) => new Date(interview.scheduledAt).getTime() >= cutoff)
    .flatMap((interview) => {
      const application = byId.get(interview.applicationId);
      return application ? [{ interview, application }] : [];
    })
    .sort((a, b) => a.interview.scheduledAt.localeCompare(b.interview.scheduledAt));
}
