import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ThemeToggle from './ThemeToggle/ThemeToggle';
import GitHubIcon from '@mui/icons-material/GitHub';

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export function SidebarContent({ toggleTheme, mode }) {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Expenses', icon: <BarChartIcon />, path: '/expenses' },
    { text: 'Income', icon: <AttachMoneyIcon />, path: '/income' },
    { text: 'Transactions', icon: <ReceiptIcon />, path: '/transactions' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List>
        {menuItems.map((item) => (
          <StyledListItem
            key={item.text}
            component={Link}
            to={item.path}
            active={location.pathname === item.path ? 1 : 0}
            sx={{ '&:hover': { cursor: 'pointer' } }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ color: 'inherit' }} />
          </StyledListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box 
          component={Link}
          to="https://github.com/AmarBego/React-Personal-Finance"
          target="_blank"
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <GitHubIcon sx={{ fontSize: 24 }} />
          <Typography variant="caption">Open Source</Typography>
        </Box>
        <ThemeToggle mode={mode} toggleTheme={toggleTheme} />
      </Box>
    </Box>
  );
}