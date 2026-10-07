import { NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import WorkHistoryRounded from '@mui/icons-material/WorkHistoryRounded';
import { DRAWER_WIDTH, HEADER_HEIGHT, WEEKLY_APPLICATION_GOAL } from '../../constants/layout';
import { NAV_ITEMS } from '../../constants/navigation';
import type { NavBadge } from '../../constants/navigation';
import { useApplications } from '../../hooks/useApplications';
import { countAppliedWithin, getUpcomingInterviews } from '../../utils/analytics';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function Brand() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2.5,
        height: HEADER_HEIGHT,
        flexShrink: 0,
      }}
    >
      <Box
        sx={(theme) => ({
          width: 36,
          height: 36,
          borderRadius: 2.5,
          display: 'grid',
          placeItems: 'center',
          color: 'primary.contrastText',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
        })}
      >
        <WorkHistoryRounded sx={{ fontSize: 20 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle1" component="p" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
          Smart Job Tracker
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
          Your career workspace
        </Typography>
      </Box>
    </Box>
  );
}

function WeeklyGoal() {
  const { applications } = useApplications();
  const thisWeek = countAppliedWithin(applications, 7);
  const progress = Math.min(100, Math.round((thisWeek / WEEKLY_APPLICATION_GOAL) * 100));

  return (
    <Box
      sx={(theme) => ({
        m: 2,
        p: 2,
        borderRadius: 3,
        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.06 : 0.12),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
      })}
    >
      <Typography variant="subtitle2">Weekly goal</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {thisWeek} of {WEEKLY_APPLICATION_GOAL} applications in the last 7 days
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        aria-label={`Weekly goal progress: ${progress}%`}
        sx={{ mt: 1.25 }}
      />
    </Box>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { applications, interviews } = useApplications();
  const badges: Record<NavBadge, number> = {
    applications: applications.length,
    interviews: getUpcomingInterviews(interviews, applications).length,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Brand />
      <Box component="nav" aria-label="Main navigation" sx={{ flexGrow: 1, overflowY: 'auto', px: 1.5, pt: 1 }}>
        <Typography variant="overline" sx={{ display: 'block', px: 1.5, pb: 0.5, color: 'text.secondary' }}>
          Menu
        </Typography>
        <List disablePadding sx={{ display: 'grid', gap: 0.5 }}>
          {NAV_ITEMS.map(({ label, path, icon: Icon, badge }) => (
            <ListItemButton
              key={path}
              component={NavLink}
              to={path}
              end={path === '/'}
              onClick={onNavigate}
              sx={(theme) => ({
                px: 1.5,
                py: 1,
                color: 'text.secondary',
                '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 36 },
                '&:hover': { color: 'text.primary' },
                '&.active': {
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.16),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.12 : 0.2) },
                },
              })}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                {label}
              </Typography>
              {badge && badges[badge] > 0 && (
                <Box
                  component="span"
                  aria-label={`${badges[badge]} ${badge}`}
                  sx={{
                    minWidth: 24,
                    px: 0.75,
                    py: 0.125,
                    borderRadius: 999,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    bgcolor: 'action.hover',
                    color: 'text.secondary',
                    '.active &': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                  }}
                >
                  {badges[badge]}
                </Box>
              )}
            </ListItemButton>
          ))}
        </List>
      </Box>
      <WeeklyGoal />
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const paperSx = {
    boxSizing: 'border-box',
    borderRight: 1,
    borderColor: 'divider',
    bgcolor: 'background.paper',
  } as const;

  return (
    <Box component="aside" sx={{ width: { md: DRAWER_WIDTH.md, lg: DRAWER_WIDTH.lg }, flexShrink: { md: 0 } }}>
      {/* Mobile & tablet: temporary overlay drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        keepMounted
        sx={{ display: { xs: 'block', md: 'none' } }}
        slotProps={{ paper: { sx: { ...paperSx, width: 280, maxWidth: '85vw' } } }}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </Drawer>
      {/* Desktop: permanent drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: 'none', md: 'block' } }}
        slotProps={{ paper: { sx: { ...paperSx, width: { md: DRAWER_WIDTH.md, lg: DRAWER_WIDTH.lg } } } }}
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
}
