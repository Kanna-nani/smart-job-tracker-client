import DashboardRounded from '@mui/icons-material/DashboardRounded';
import WorkOutlineRounded from '@mui/icons-material/WorkOutlineRounded';
import EventAvailableRounded from '@mui/icons-material/EventAvailableRounded';
import InsightsRounded from '@mui/icons-material/InsightsRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import type { IconComponent } from '../types/ui';

export type NavBadge = 'applications' | 'interviews';

export interface NavItem {
  label: string;
  path: string;
  icon: IconComponent;
  badge?: NavBadge;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: DashboardRounded },
  { label: 'Applications', path: '/applications', icon: WorkOutlineRounded, badge: 'applications' },
  { label: 'Interviews', path: '/interviews', icon: EventAvailableRounded, badge: 'interviews' },
  { label: 'Analytics', path: '/analytics', icon: InsightsRounded },
  { label: 'Settings', path: '/settings', icon: SettingsRounded },
];

export const getPageTitle = (pathname: string): string =>
  NAV_ITEMS.find((item) => item.path === pathname)?.label ?? 'Dashboard';
