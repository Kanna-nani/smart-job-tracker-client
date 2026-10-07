import { daysFromToday } from '../utils/date';

export type NotificationKind = 'interview' | 'offer' | 'update' | 'reminder';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

export const mockNotifications: AppNotification[] = [
  {
    id: 'n-1',
    kind: 'interview',
    title: 'Technical round today',
    description: 'Citimedia · Frontend Developer at 3:30 pm',
    createdAt: daysFromToday(0, 8),
    read: false,
  },
  {
    id: 'n-2',
    kind: 'update',
    title: 'Moved to HR Round',
    description: 'Microsoft · Software Engineer – Frontend',
    createdAt: daysFromToday(-1, 17),
    read: false,
  },
  {
    id: 'n-3',
    kind: 'offer',
    title: 'Offer received',
    description: 'Atlassian · Senior Frontend Engineer',
    createdAt: daysFromToday(-6, 13),
    read: false,
  },
  {
    id: 'n-4',
    kind: 'reminder',
    title: 'Follow up on your application',
    description: 'Myntra · No response in 30+ days',
    createdAt: daysFromToday(-2, 9),
    read: true,
  },
];
