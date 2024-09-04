import React from 'react';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const Income = ({ userTransactions }) => {
  const incomes = userTransactions.filter(t => t.type === 'income');

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Income</Typography>
      <List>
        {incomes.map((income, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={income.category} 
              secondary={`$${income.amount} - ${income.date}`} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Income;