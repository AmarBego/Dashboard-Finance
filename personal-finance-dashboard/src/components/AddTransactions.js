import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { format, parseISO } from 'date-fns';

const AddTransaction = ({ onAddTransaction, currentMonth }) => {
  const [transaction, setTransaction] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense',
    category: '',
    amount: '',
    isPaid: false,
    dueDate: '',
  });

  useEffect(() => {
    const [year, month] = currentMonth.split('-');
    const [, , day] = transaction.date.split('-');
    setTransaction(prev => ({
      ...prev,
      date: `${year}-${month}-${day}`
    }));
  }, [currentMonth]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'date') {
      const [inputYear, inputMonth] = value.split('-');
      if (`${inputYear}-${inputMonth}` !== currentMonth) {
        const [year, month] = currentMonth.split('-');
        const [, , day] = value.split('-');
        value = `${year}-${month}-${day}`;
      }
    }
    setTransaction({ ...transaction, [e.target.name]: value });
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
        setTransaction({
          date: format(new Date(), 'yyyy-MM-dd'),
          type: 'expense',
          category: '',
          amount: '',
          isPaid: false,
          dueDate: '',
        });
      } else {
        console.error('Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={transaction.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: `${currentMonth}-01`,
              max: `${currentMonth}-31`
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Type"
            name="type"
            value={transaction.type}
            onChange={handleChange}
            required
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={transaction.category}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            name="amount"
            value={transaction.amount}
            onChange={handleChange}
            required
          />
        </Grid>
        {transaction.type === 'expense' && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date (leave blank if none)"
              type="date"
              name="dueDate"
              value={transaction.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add Transaction
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};


export default AddTransaction;