import React from 'react';
import { Typography, Grid, Box, Tooltip } from '@mui/material';
import { format, isAfter, parseISO } from 'date-fns';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const BudgetOverview = ({ transactions }) => {
  const today = new Date();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && (!t.dueDate || t.isPaid))
    .reduce((sum, t) => sum + t.amount, 0);

  const duePayments = transactions
    .filter(t => t.type === 'expense' && t.dueDate && !t.isPaid && isAfter(parseISO(t.dueDate), today))
    .sort((a, b) => parseISO(a.dueDate) - parseISO(b.dueDate));

  const totalDuePayments = duePayments.reduce((sum, t) => sum + t.amount, 0);

  const currentBudget = totalIncome - totalExpenses;
  const budgetAfterDuePayments = currentBudget - totalDuePayments;


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Budget Overview</Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="body2">Income:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" align="right">{formatCurrency(totalIncome)}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Expenses:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" align="right">{formatCurrency(totalExpenses)}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" fontWeight="bold">Current Budget:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" align="right" fontWeight="bold" color={currentBudget >= 0 ? 'success.main' : 'error.main'}>
            {formatCurrency(currentBudget)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Due Payments:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" align="right">{formatCurrency(totalDuePayments)}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" fontWeight="bold">After Due Payments:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" align="right" fontWeight="bold" color={budgetAfterDuePayments >= 0 ? 'success.main' : 'error.main'}>
            {formatCurrency(budgetAfterDuePayments)}
          </Typography>
        </Grid>
      </Grid>
      
      {duePayments.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center">
            Upcoming Due Payments
            <Tooltip title={duePayments.map(p => `${p.category}: ${formatCurrency(p.amount)} (Due: ${format(parseISO(p.dueDate), 'MMM d')})`).join('\n')} arrow>
              <InfoOutlinedIcon fontSize="small" sx={{ ml: 1 }} />
            </Tooltip>
          </Typography>
          <Typography variant="body2">
            {duePayments.length} payment{duePayments.length > 1 ? 's' : ''} totaling {formatCurrency(totalDuePayments)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BudgetOverview;