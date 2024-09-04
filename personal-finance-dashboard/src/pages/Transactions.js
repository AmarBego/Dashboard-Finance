import React, { useState, useMemo } from 'react';
import { 
  Typography, List, ListItem, Paper, Button, TextField, Box, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Backdrop, Chip
} from '@mui/material';
import AddTransaction from '../components/AddTransactions';
import { format, parseISO } from 'date-fns';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Transactions = ({ userTransactions, handleAddTransaction, currentMonth, user, updateTransaction }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const sortedTransactions = useMemo(() => {
    return [...userTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [userTransactions]);

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditedTransaction({
      ...transaction,
      date: transaction.date ? transaction.date.split('T')[0] : '',
      amount: transaction.amount || '',
      category: transaction.category || '',
      type: transaction.type || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleChange = (e) => {
    setEditedTransaction({ ...editedTransaction, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateTransaction(editedTransaction);
    setIsEditDialogOpen(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsEditDialogOpen(false);
    setEditingId(null);
    setEditedTransaction({});
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <AddTransaction handleAddTransaction={handleAddTransaction} currentMonth={currentMonth} user={user} />
      <List>
        {sortedTransactions.map((transaction) => (
          <ListItem 
            key={transaction._id}
            sx={{
              borderLeft: 6,
              borderColor: transaction.type === 'income' ? 'success.main' : 'error.main',
              mb: 2,
              backgroundColor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {transaction.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(parseISO(transaction.date), 'MMMM d, yyyy')}
                </Typography>
                <Typography variant="h6" color={transaction.type === 'income' ? 'success.main' : 'error.main'}>
                  {formatCurrency(transaction.amount)}
                </Typography>
              </Box>
              <Chip 
                icon={transaction.type === 'income' ? <AttachMoneyIcon /> : <ShoppingCartIcon />}
                label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                color={transaction.type === 'income' ? 'success' : 'error'}
                size="small"
              />
            </Box>
            <Box alignSelf="flex-end" mt={1}>
              <Button variant="outlined" size="small" onClick={() => handleEdit(transaction)}>
                Edit
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleCancel}
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(3px)' }
        }}
      >
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="date"
              label="Date"
              type="date"
              value={editedTransaction.date || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="type"
              select
              label="Type"
              value={editedTransaction.type || ''}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
            <TextField
              name="category"
              label="Category"
              value={editedTransaction.category || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="amount"
              label="Amount"
              type="number"
              value={editedTransaction.amount || ''}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Transactions;