import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Select, MenuItem, InputAdornment,
  Paper, Typography, IconButton, Collapse
} from '@mui/material';
import { Add, Remove, AttachMoney, Category, Event, EventAvailable } from '@mui/icons-material';
import { format } from 'date-fns';

const INITIAL_TRANSACTION = {
  date: format(new Date(), 'yyyy-MM-dd'),
  type: 'expense',
  category: '',
  amount: '',
  isPaid: false,
  dueDate: '',
};

const AddTransaction = ({ onAddTransaction, currentMonth, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transaction, setTransaction] = useState(INITIAL_TRANSACTION);

  useEffect(() => {
    if (currentMonth) {
      const [year, month] = currentMonth.split('-');
      const [, , day] = transaction.date.split('-');
      setTransaction(prev => ({
        ...prev,
        date: `${year}-${month}-${day}`
      }));
    }
  }, [currentMonth, transaction.date]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          ...transaction,
          amount: parseFloat(transaction.amount),
          dueDate: transaction.dueDate || null,
        })
      });
      if (response.ok) {
        const newTransaction = await response.json();
        onAddTransaction(newTransaction);
        setTransaction(INITIAL_TRANSACTION);
        setIsExpanded(false);
      } else {
        console.error('Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        mb: 3, 
        overflow: 'hidden', 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box 
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          },
          transition: 'background-color 0.2s',
        }}
      >
        <Typography variant="h6">Add New Transaction</Typography>
        <IconButton>
          {isExpanded ? <Remove /> : <Add />}
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <TextField
            name="date"
            label="Date"
            type="date"
            value={transaction.date}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Event />
                </InputAdornment>
              ),
            }}
            inputProps={{
              min: `${currentMonth}-01`,
              max: `${currentMonth}-31`
            }}
            fullWidth
            required
          />
          <Select
            name="type"
            value={transaction.type}
            onChange={handleChange}
            fullWidth
            required
            startAdornment={<InputAdornment position="start"><Category /></InputAdornment>}
          >
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </Select>
          <TextField
            name="category"
            label="Category"
            value={transaction.category}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="amount"
            label="Amount"
            type="number"
            value={transaction.amount}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              ),
            }}
            fullWidth
            required
          />
          {transaction.type === 'expense' && (
            <TextField
              name="dueDate"
              label="Due Date (optional)"
              type="date"
              value={transaction.dueDate}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventAvailable />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          )}
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ 
              gridColumn: '1 / -1', 
              mt: 2,
            }}
          >
            Add Transaction
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AddTransaction;