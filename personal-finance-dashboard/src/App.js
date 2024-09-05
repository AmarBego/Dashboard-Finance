import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { useTheme } from './hooks/useTheme';
import GlobalStyle from './styles/global';
import Layout from './components/Layout';
import AppRoutes from './routes';
import { SnackbarProvider } from 'notistack';

function App() {
  const { user, handleLogin, handleLogout } = useAuth();
  const { userTransactions, handleAddTransaction, updateTransaction, deleteTransaction, fetchTransactions } = useTransactions(user);
  const { mode, toggleTheme, theme } = useTheme();

  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <Layout user={user} onLogout={handleLogout} toggleTheme={toggleTheme} mode={mode}>
            <AppRoutes 
              user={user}
              userTransactions={userTransactions}
              handleAddTransaction={handleAddTransaction}
              updateTransaction={updateTransaction}
              fetchTransactions={fetchTransactions}
              deleteTransaction={deleteTransaction}
              onLogin={handleLogin}
            />
          </Layout>
        </Router>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;