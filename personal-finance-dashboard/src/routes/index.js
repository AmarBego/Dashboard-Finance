import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import Income from '../pages/Income';
import Transactions from '../pages/Transactions';
import EmailConfirmation from '../components/EmailConfirmation';
import Auth from '../components/Auth/Auth';

const AppRoutes = ({ user, userTransactions, currentMonth, handlePreviousMonth, handleNextMonth, handleAddTransaction, updateTransaction, fetchTransactions, deleteTransaction, onLogin }) => (
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
        <Transactions 
          userTransactions={userTransactions} 
          handleAddTransaction={handleAddTransaction}
          currentMonth={currentMonth}
          user={user}
          updateTransaction={updateTransaction}
          fetchTransactions={fetchTransactions}
          deleteTransaction={deleteTransaction}
        />
      } 
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;