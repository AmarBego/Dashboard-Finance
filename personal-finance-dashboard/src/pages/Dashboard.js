import React from 'react';
import { Grid, Typography, Button, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import ExpenseChart from '../components/ExpenseChart';
import IncomeVsExpense from '../components/IncomeVsExpense';
import RecentTransactions from '../components/RecentTransactions';
import BudgetOverview from '../components/BudgetOverview';
import AddTransaction from '../components/AddTransactions';
import { format, parseISO } from 'date-fns';

const MotionPaper = motion(Paper);

const Dashboard = ({ userTransactions, currentMonth, handlePreviousMonth, handleNextMonth, handleAddTransaction, user }) => {
  const filteredTransactions = userTransactions.filter(transaction => transaction.date.startsWith(currentMonth));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MotionPaper
          elevation={3}
          sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Box>
            <Button variant="outlined" onClick={handlePreviousMonth}>Previous</Button>
            <Typography variant="h4" component="span" sx={{ mx: 2 }}>
              {format(parseISO(`${currentMonth}-01`), 'MMMM yyyy')}
            </Typography>
            <Button variant="outlined" onClick={handleNextMonth}>Next</Button>
          </Box>
          <AddTransaction onAddTransaction={handleAddTransaction} currentMonth={currentMonth} userEmail={user.email} />
        </MotionPaper>
      </Grid>
      <Grid item xs={12} md={8}>
        <MotionPaper
          elevation={3}
          sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Typography variant="h6" gutterBottom>Expenses by Category</Typography>
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <ExpenseChart transactions={filteredTransactions} />
          </Box>
        </MotionPaper>
      </Grid>
      <Grid item xs={12} md={4}>
        <MotionPaper
          elevation={3}
          sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <BudgetOverview transactions={filteredTransactions} />
        </MotionPaper>
      </Grid>
      <Grid item xs={12} md={6}>
        <MotionPaper
          elevation={3}
          sx={{ p: 2, height: '300px', display: 'flex', flexDirection: 'column' }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Typography variant="h6" gutterBottom>Income vs Expense</Typography>
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <IncomeVsExpense transactions={filteredTransactions} />
          </Box>
        </MotionPaper>
      </Grid>
      <Grid item xs={12} md={6}>
        <MotionPaper
          elevation={3}
          sx={{ p: 2, height: '300px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
          <RecentTransactions transactions={filteredTransactions} />
        </MotionPaper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;