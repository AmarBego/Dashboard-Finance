import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const BudgetOverview = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = totalIncome - totalExpenses;

  return (
    <>
      <Typography variant="h6" gutterBottom>Budget Overview</Typography>
      <List>
        <ListItem>
          <ListItemText primary="Total Income" secondary={`$${totalIncome.toFixed(2)}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Total Expenses" secondary={`$${totalExpenses.toFixed(2)}`} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText 
            primary="Remaining Budget" 
            secondary={`$${remainingBudget.toFixed(2)}`}
            secondaryTypographyProps={{ 
              color: remainingBudget >= 0 ? 'success.main' : 'error.main',
              fontWeight: 'bold'
            }}
          />
        </ListItem>
      </List>
    </>
  );
};

export default BudgetOverview;