import { useState } from 'react';
import type { MouseEvent } from 'react';
import { Badge, Box, Button, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import EventAvailableRounded from '@mui/icons-material/EventAvailableRounded';
import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import SyncAltRounded from '@mui/icons-material/SyncAltRounded';
import AlarmRounded from '@mui/icons-material/AlarmRounded';
import { getStatusColor } from '../../constants/status';
import { mockNotifications } from '../../data/mockNotifications';
import type { NotificationKind } from '../../data/mockNotifications';
import type { IconComponent } from '../../types/ui';
import { formatRelative } from '../../utils/date';

const KIND_ICONS: Record<NotificationKind, IconComponent> = {
  interview: EventAvailableRounded,
  offer: EmojiEventsRounded,
  update: SyncAltRounded,
  reminder: AlarmRounded,
};

export default function NotificationsMenu() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unread = notifications.filter((n) => !n.read).length;

  const kindColor: Record<NotificationKind, string> = {
    interview: getStatusColor('Interview', theme.palette.mode),
    offer: getStatusColor('Offer', theme.palette.mode),
    update: theme.palette.primary.main,
    reminder: theme.palette.text.secondary,
  };

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          aria-label={`Notifications, ${unread} unread`}
          aria-haspopup="true"
          aria-controls={anchorEl ? 'notifications-menu' : undefined}
          onClick={(event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)}
        >
          <Badge color="error" variant="dot" invisible={unread === 0} overlap="circular">
            <NotificationsNoneRounded />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 360, maxWidth: 'calc(100vw - 32px)', mt: 1 } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
          <Typography variant="subtitle1" component="h2">
            Notifications
          </Typography>
          <Button
            size="small"
            disabled={unread === 0}
            onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
          >
            Mark all as read
          </Button>
        </Box>
        <Divider sx={{ mb: 0.5 }} />
        {notifications.map((notification) => {
          const Icon = KIND_ICONS[notification.kind];
          const color = kindColor[notification.kind];
          return (
            <MenuItem
              key={notification.id}
              onClick={() => markRead(notification.id)}
              sx={{ alignItems: 'flex-start', gap: 1.5, py: 1.25, whiteSpace: 'normal' }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color,
                  bgcolor: alpha(color, 0.12),
                }}
              >
                <Icon sx={{ fontSize: 18 }} />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 500 : 650 }}>
                  {notification.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {notification.description}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatRelative(notification.createdAt)}
                </Typography>
              </Box>
              {!notification.read && (
                <Box
                  aria-label="Unread"
                  sx={{ width: 8, height: 8, mt: 0.75, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }}
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
