import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { DRAWER_WIDTH, HEADER_HEIGHT } from '../../constants/layout';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onMenuClick={() => setMobileOpen(true)} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // minWidth: 0 lets wide children (tables) scroll inside instead of widening the page.
          minWidth: 0,
          width: { md: `calc(100% - ${DRAWER_WIDTH.md}px)`, lg: `calc(100% - ${DRAWER_WIDTH.lg}px)` },
          pt: { xs: `${HEADER_HEIGHT.xs}px`, md: `${HEADER_HEIGHT.md}px` },
        }}
      >
        <Box
          sx={{
            maxWidth: 1440,
            mx: 'auto',
            px: { xs: 2, sm: 3, lg: 4 },
            py: { xs: 2.5, sm: 3, lg: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
