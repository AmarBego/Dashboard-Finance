import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import Income from '../pages/Income';
import Transactions from '../pages/Transactions';

const AppRoutes = ({ user, userTransactions, currentMonth, handlePreviousMonth, handleNextMonth, handleAddTransaction, updateTransaction, fetchTransactions, deleteTransaction }) => (
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
);

export default AppRoutes;