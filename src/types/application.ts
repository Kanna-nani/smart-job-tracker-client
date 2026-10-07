/** Ordered by pipeline stage — used for status sorting and chart ordering. */
export const APPLICATION_STATUSES = [
  'Applied',
  'Interview',
  'Technical Round',
  'HR Round',
  'Offer',
  'Rejected',
  'Withdrawn',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Shape mirrors the backend document so the mock data can later be swapped for API data. */
export interface JobApplication {
  _id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  jobUrl?: string;
  location?: string;
  appliedDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationInput = Omit<JobApplication, '_id' | 'createdAt' | 'updatedAt'>;

export type InterviewMode = 'Video' | 'Onsite' | 'Phone';

export interface Interview {
  _id: string;
  applicationId: string;
  stage: ApplicationStatus;
  scheduledAt: string;
  durationMinutes: number;
  mode: InterviewMode;
  interviewer: string;
}

export interface ScheduledInterview {
  interview: Interview;
  application: JobApplication;
}
