import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { useTheme } from './hooks/useTheme';
import GlobalStyle from './styles/global';
import Auth from './components/Auth/Auth';
import Layout from './components/Layout';
import AppRoutes from './routes';
import { SnackbarProvider } from 'notistack';
import EmailConfirmation from './components/EmailConfirmation';

function App() {
  const { user, handleLogin, handleLogout } = useAuth();
  const { userTransactions, handleAddTransaction, updateTransaction, deleteTransaction, fetchTransactions } = useTransactions(user);
  const { mode, toggleTheme, theme } = useTheme();

  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
  <Routes>
    <Route path="/confirm/:token" element={<EmailConfirmation />} />
    <Route path="/login" element={user ? <Navigate to="/" replace /> : <Auth onLogin={handleLogin} />} />
    {user ? (
      <Route path="/*" element={
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
      } />
    ) : (
      <Route path="*" element={<Navigate to="/login" replace />} />
    )}
  </Routes>
</Router>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;