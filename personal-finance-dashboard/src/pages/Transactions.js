import React, { useState, useMemo } from 'react';
import { 
  Typography, List, ListItem, Paper, Button, TextField, Box, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Backdrop, Chip,
  FormControlLabel, Checkbox, IconButton
} from '@mui/material';
import AddTransaction from '../components/AddTransactions/AddTransactions';
import { format, parseISO } from 'date-fns';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';

const Transactions = ({ userTransactions, handleAddTransaction, currentMonth, user, updateTransaction, fetchTransactions, deleteTransaction }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const sortedTransactions = useMemo(() => {
    return [...userTransactions].sort((a, b) => {
      const aIsDue = a.type === 'expense' && a.dueDate && !a.isPaid;
      const bIsDue = b.type === 'expense' && b.dueDate && !b.isPaid;
      
      if (aIsDue && !bIsDue) return -1;
      if (!aIsDue && bIsDue) return 1;
      if (aIsDue && bIsDue) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return new Date(b.date) - new Date(a.date);
    });
  }, [userTransactions]);

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditedTransaction({
      ...transaction,
      date: transaction.date ? transaction.date.split('T')[0] : '',
      dueDate: transaction.dueDate ? transaction.dueDate.split('T')[0] : '',
      amount: transaction.amount || '',
      category: transaction.category || '',
      type: transaction.type || '',
      isPaid: transaction.isPaid || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEditedTransaction({ ...editedTransaction, [e.target.name]: value });
  };

  const handleSave = async () => {
    const updatedTransactionData = {
      ...editedTransaction,
      isPaid: editedTransaction.dueDate ? (editedTransaction.isPaid || false) : null
    };
    await updateTransaction(updatedTransactionData);
    setIsEditDialogOpen(false);
    setEditingId(null);
    fetchTransactions();
  };

  const handleCancel = () => {
    setIsEditDialogOpen(false);
    setEditingId(null);
    setEditedTransaction({});
  };

  const handlePaidToggle = async (transaction) => {
    const updatedTransaction = {
      ...transaction,
      isPaid: transaction.dueDate ? !transaction.isPaid : null,
    };
    try {
      await updateTransaction(updatedTransaction);
      await fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const isDuePayment = (transaction) => {
    return transaction.type === 'expense' && transaction.dueDate && !transaction.isPaid;
  };

  const onAddTransaction = async (newTransaction) => {
    try {
      await handleAddTransaction(newTransaction);
      await fetchTransactions();
    } catch (error) {
      console.error('Error adding new transaction:', error);
    }
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete._id);
        await fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
    setIsDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <AddTransaction 
        onAddTransaction={onAddTransaction} 
        currentMonth={currentMonth} 
        user={user} 
      />
      <List>
        {sortedTransactions.map((transaction) => (
          <ListItem 
            key={transaction._id}
            sx={{
              borderLeft: 6,
              borderColor: transaction.type === 'income' ? 'success.main' : 'error.main',
              mb: 2,
              backgroundColor: isDuePayment(transaction) ? 'rgba(255, 0, 0, 0.05)' : 'background.paper',
              borderRadius: 1,
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              opacity: transaction.isPaid ? 0.6 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center">
                  {isDuePayment(transaction) && (
                    <PushPinIcon sx={{ mr: 1, color: 'error.main' }} fontSize="small" />
                  )}
                  {transaction.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(parseISO(transaction.date), 'MMMM d, yyyy')}
                </Typography>
                <Typography variant="h6" color={transaction.type === 'income' ? 'success.main' : 'error.main'}>
                  {formatCurrency(transaction.amount)}
                </Typography>
                {transaction.dueDate && (
                  <Typography variant="body2" color="text.secondary">
                    Due: {format(parseISO(transaction.dueDate), 'MMMM d, yyyy')}
                  </Typography>
                )}
              </Box>
              <Box>
                <Chip 
                  icon={transaction.type === 'income' ? <AttachMoneyIcon /> : <ShoppingCartIcon />}
                  label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  color={transaction.type === 'income' ? 'success' : 'error'}
                  size="small"
                />
                {transaction.type === 'expense' && transaction.dueDate && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={transaction.isPaid}
                        onChange={() => handlePaidToggle(transaction)}
                      />
                    }
                    label="Paid"
                  />
                )}
              </Box>
            </Box>
            <Box alignSelf="flex-end" mt={1}>
              <Button variant="outlined" size="small" onClick={() => handleEdit(transaction)}>
                Edit
              </Button>
              <IconButton onClick={() => handleDeleteClick(transaction)} color="error" size="small">
                <DeleteIcon />
              </IconButton>
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
            {editedTransaction.type === 'expense' && (
              <>
                <TextField
                  name="dueDate"
                  label="Due Date (leave blank if none)"
                  type="date"
                  value={editedTransaction.dueDate || ''}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                {editedTransaction.dueDate && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isPaid"
                        checked={editedTransaction.isPaid || false}
                        onChange={handleChange}
                      />
                    }
                    label="Paid"
                  />
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
  
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Transactions;