import React from 'react';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const Expenses = ({ userTransactions }) => {
  const expenses = userTransactions.filter(t => t.type === 'expense');

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Expenses</Typography>
      <List>
        {expenses.map((expense, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={expense.category} 
              secondary={`$${expense.amount} - ${expense.date}`} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Expenses;