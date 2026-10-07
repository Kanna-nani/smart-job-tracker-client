import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Box, IconButton, InputAdornment, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuRounded from '@mui/icons-material/MenuRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import { DRAWER_WIDTH, HEADER_HEIGHT } from '../../constants/layout';
import { getPageTitle } from '../../constants/navigation';
import { useApplications } from '../../hooks/useApplications';
import { useColorMode } from '../../hooks/useColorMode';
import { formatLongToday } from '../../utils/date';
import NotificationsMenu from './NotificationsMenu';
import UserMenu from './UserMenu';

interface HeaderProps {
  onMenuClick: () => void;
}

const APPLICATIONS_PATH = '/applications';

export default function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useApplications();
  const { mode, toggleMode } = useColorMode();

  // Searching from any page jumps to the applications list, which reads the same query.
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (pathname !== APPLICATIONS_PATH) navigate(APPLICATIONS_PATH);
  };

  return (
    <AppBar
      position="fixed"
      sx={(theme) => ({
        width: { md: `calc(100% - ${DRAWER_WIDTH.md}px)`, lg: `calc(100% - ${DRAWER_WIDTH.lg}px)` },
        ml: { md: `${DRAWER_WIDTH.md}px`, lg: `${DRAWER_WIDTH.lg}px` },
        bgcolor: alpha(theme.palette.background.default, 0.82),
        backdropFilter: 'saturate(180%) blur(10px)',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
      })}
    >
      <Toolbar disableGutters sx={{ minHeight: HEADER_HEIGHT, gap: { xs: 0.5, sm: 1.5 }, px: { xs: 1, sm: 3, lg: 4 } }}>
        <IconButton
          aria-label="Open navigation menu"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuRounded />
        </IconButton>

        <Box sx={{ minWidth: 0, flexGrow: { xs: 1, sm: 0 }, flexShrink: 0, mr: { sm: 1 } }}>
          <Typography variant="h6" component="p" noWrap>
            {getPageTitle(pathname)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', lg: 'block' } }} noWrap>
            {formatLongToday()}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', minWidth: 0 }}>
          <TextField
            size="small"
            placeholder="Search applications…"
            value={searchQuery}
            onChange={(event) => handleSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') navigate(APPLICATIONS_PATH);
            }}
            sx={{ width: '100%', maxWidth: 440 }}
            slotProps={{
              htmlInput: { 'aria-label': 'Search applications', type: 'search' },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" edge="end" aria-label="Clear search" onClick={() => setSearchQuery('')}>
                      <CloseRounded fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.5 }, flexShrink: 0 }}>
          <Tooltip title="Search applications">
            <IconButton
              aria-label="Search applications"
              onClick={() => navigate(APPLICATIONS_PATH, { state: { focusSearch: true } })}
              sx={{ display: { sm: 'none' } }}
            >
              <SearchRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            <IconButton
              aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              onClick={toggleMode}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              {mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}
            </IconButton>
          </Tooltip>
          <NotificationsMenu />
          <Box sx={{ ml: { xs: 0.25, sm: 0.5 } }}>
            <UserMenu />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
