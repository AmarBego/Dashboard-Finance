import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';

import { format, addMonths, subMonths, parseISO } from 'date-fns';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';

import Header from './components/Header';
import Auth from './components/Auth';

import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Transactions from './pages/Transactions';
import ThemeToggle from './components/ThemeToggle';
import getTheme from './theme';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function SidebarContent({ toggleTheme, mode }) {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Expenses', icon: <BarChartIcon />, path: '/expenses' },
    { text: 'Income', icon: <AttachMoneyIcon />, path: '/income' },
    { text: 'Transactions', icon: <ReceiptIcon />, path: '/transactions' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List sx={{ flexGrow: 1 }}>
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
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <ThemeToggle mode={mode} toggleTheme={toggleTheme} />
      </Box>
    </Box>
  );
}

function App() {
  const [userTransactions, setUserTransactions] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 500);
      return newMode;
    });
  };

  useEffect(() => {
    document.body.dataset.theme = mode;
  }, [mode]);

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      setUser({ email, token });
    }
  }, []);

  useEffect(() => {
    if (user && user.token) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      if (!user || !user.token) return;
      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          'x-auth-token': user.token
        }
      });
      if (response.ok) {
        const transactions = await response.json();
        setUserTransactions(Array.isArray(transactions) ? transactions : []);
      } else {
        console.error('Failed to fetch transactions:', response.status);
        if (response.status === 401) {
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setUserTransactions([]);
    }
  };
  
  const deleteTransaction = async (transactionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': user.token
        }
      });
      if (response.ok) {
        setUserTransactions(prevTransactions => 
          prevTransactions.filter(transaction => transaction._id !== transactionId)
        );
      } else {
        console.error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('email', userData.email);
  };

  const handleLogout = () => {
    setUser(null);
    setUserTransactions([]);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  const handleAddTransaction = (newTransaction) => {
    setUserTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(format(subMonths(parseISO(`${currentMonth}-01`), 1), 'yyyy-MM'));
  };
  const handleNextMonth = () => {
    setCurrentMonth(format(addMonths(parseISO(`${currentMonth}-01`), 1), 'yyyy-MM'));
  };

  const updateTransaction = async (updatedTransaction) => {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${updatedTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(updatedTransaction)
      });
  
      if (response.ok) {
        const updated = await response.json();
        setUserTransactions(prevTransactions => 
          prevTransactions.map(t => t._id === updated._id ? updated : t)
        );
      } else {
        console.error('Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };
  
// eslint-disable-next-line no-unused-vars
const filteredTransactions = Array.isArray(userTransactions) 
  ? userTransactions.filter(transaction => transaction.date.startsWith(currentMonth))
  : [];

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
          <Header user={user} onLogout={handleLogout} onDrawerToggle={() => setDrawerOpen(!drawerOpen)} />
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
              <Routes>
                <Route path="/" element={
                  <Dashboard 
                    userTransactions={userTransactions}
                    currentMonth={currentMonth}
                    handlePreviousMonth={handlePreviousMonth}
                    handleNextMonth={handleNextMonth}
                    handleAddTransaction={handleAddTransaction}
                    user={user}
                  />
                } />
                <Route path="/expenses" element={<Expenses userTransactions={userTransactions} />} />
                <Route path="/income" element={<Income userTransactions={userTransactions} />} />
                <Route 
                  path="/transactions" 
                  element={
                    user ? (
<Transactions 
  userTransactions={userTransactions} 
  handleAddTransaction={handleAddTransaction}
  currentMonth={currentMonth}
  user={user}
  updateTransaction={updateTransaction}
  fetchTransactions={fetchTransactions}
  deleteTransaction={deleteTransaction}
/>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
              </Routes>
            </Box>
          </Main>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;