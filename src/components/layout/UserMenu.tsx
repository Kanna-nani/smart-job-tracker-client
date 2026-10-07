import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, ButtonBase, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import { MOCK_USER } from '../../data/mockUser';
import { useApplications } from '../../hooks/useApplications';
import { useColorMode } from '../../hooks/useColorMode';
import { getInitials } from '../../utils/applications';

export default function UserMenu() {
  const navigate = useNavigate();
  const { mode, toggleMode } = useColorMode();
  const { notify } = useApplications();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const close = () => setAnchorEl(null);

  return (
    <>
      <ButtonBase
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-label="Open account menu"
        aria-haspopup="true"
        aria-controls={anchorEl ? 'user-menu' : undefined}
        sx={{ borderRadius: 999, p: 0.5, pr: { xs: 0.5, md: 1 }, gap: 1, '&:hover': { bgcolor: 'action.hover' } }}
      >
        <Avatar sx={{ width: 34, height: 34, fontSize: 14, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          {getInitials(MOCK_USER.name)}
        </Avatar>
        <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
          <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
            {MOCK_USER.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
            {MOCK_USER.role}
          </Typography>
        </Box>
        <KeyboardArrowDownRounded fontSize="small" sx={{ display: { xs: 'none', md: 'block' }, color: 'text.secondary' }} />
      </ButtonBase>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 240, mt: 1 } } }}
      >
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography variant="subtitle2">{MOCK_USER.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {MOCK_USER.email}
          </Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            close();
            navigate('/settings');
          }}
        >
          <ListItemIcon>
            <PersonOutlineRounded fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            close();
            navigate('/settings');
          }}
        >
          <ListItemIcon>
            <SettingsOutlined fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={toggleMode}>
          <ListItemIcon>
            {mode === 'light' ? <DarkModeOutlined fontSize="small" /> : <LightModeOutlined fontSize="small" />}
          </ListItemIcon>
          {mode === 'light' ? 'Dark mode' : 'Light mode'}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            close();
            notify({ message: 'Sign-in isn’t connected yet — this is a UI preview.', severity: 'info' });
          }}
        >
          <ListItemIcon>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}
