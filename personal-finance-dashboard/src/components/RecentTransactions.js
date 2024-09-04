import React from 'react';
import { List, ListItem, ListItemText, Typography, Box, Divider } from '@mui/material';
import { format } from 'date-fns';

const RecentTransactions = ({ transactions }) => {
  // Sort transactions by date, most recent first
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Take only the 10 most recent transactions
  const recentTransactions = sortedTransactions.slice(0, 10);

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto' }}>
      {recentTransactions.length > 0 ? (
        recentTransactions.map((transaction, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    variant="body1"
                    color="text.primary"
                    sx={{ display: 'inline', fontWeight: 'medium' }}
                  >
                    {transaction.category}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </Typography>
                  </React.Fragment>
                }
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  minWidth: '80px',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: transaction.type === 'income' ? 'success.main' : 'error.main',
                    fontWeight: 'bold',
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                </Typography>
              </Box>
            </ListItem>
            {index < recentTransactions.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No recent transactions" />
        </ListItem>
      )}
    </List>
  );
};

export default RecentTransactions;