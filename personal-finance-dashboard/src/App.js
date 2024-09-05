import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { useTheme } from './hooks/useTheme';
import GlobalStyle from './styles/globalStyles';
import Auth from './components/Auth';
import Layout from './components/Layout';
import AppRoutes from './routes';

function App() {
  const { user, handleLogin, handleLogout } = useAuth();
  const { userTransactions, handleAddTransaction, updateTransaction, deleteTransaction, fetchTransactions } = useTransactions(user);
  const { mode, toggleTheme, theme } = useTheme();

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
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
          />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;