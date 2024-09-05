import React from 'react';
import { Grid, Typography, Box, Paper, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpenseChart from '../components/ExpenseChart';
import IncomeVsExpense from '../components/IncomeVsExpense';
import RecentTransactions from '../components/RecentTransactions';
import BudgetOverview from '../components/BudgetOverview';
import { format, parseISO } from 'date-fns';
import { useMonthNavigation } from '../hooks/useMonthNavigation';

const MotionPaper = motion.create(Paper);

const Dashboard = ({ userTransactions, user }) => {
  const { currentMonth, filteredTransactions, handlePreviousMonth, handleNextMonth } = useMonthNavigation(userTransactions);

  // Add a check to ensure userTransactions is defined
  if (!userTransactions) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MotionPaper
          elevation={3}
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <IconButton onClick={handlePreviousMonth} size="large">
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h4" component="span" sx={{ mx: 2 }}>
            {format(parseISO(`${currentMonth}-01`), 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={handleNextMonth} size="large">
            <ChevronRightIcon />
          </IconButton>
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