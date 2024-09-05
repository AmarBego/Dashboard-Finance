import React from 'react';
import { Box, Drawer, Toolbar } from '@mui/material';
import Header from './Header/Header';
import { SidebarContent } from './SidebarContent';
import { Main } from './Main';

const drawerWidth = 240;

const Layout = ({ user, onLogout, toggleTheme, mode, children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header user={user} onLogout={onLogout} onDrawerToggle={() => setDrawerOpen(!drawerOpen)} />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <Toolbar />
        <SidebarContent toggleTheme={toggleTheme} mode={mode} />
      </Drawer>
      <Main open={drawerOpen}>
        <Toolbar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Main>
    </Box>
  );
};

export default Layout;