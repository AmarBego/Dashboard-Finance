import { useState, useEffect } from 'react';

export function useTransactions(user) {
  const [userTransactions, setUserTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      if (!user || !user.token) return;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions`, {
        headers: {
          'x-auth-token': user.token
        }
      });
      if (response.ok) {
        const transactions = await response.json();
        setUserTransactions(Array.isArray(transactions) ? transactions : []);
      } else {
        console.error('Failed to fetch transactions:', response.status);
        if (response.status === 401) {
          // logout here or pass a callback
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setUserTransactions([]);
    }
  };

  const deleteTransaction = async (transactionId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': user.token
        }
      });
      if (response.ok) {
        setUserTransactions(prevTransactions => 
          prevTransactions.filter(transaction => transaction._id !== transactionId)
        );
      } else {
        console.error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleAddTransaction = (newTransaction) => {
    setUserTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  };

  const updateTransaction = async (updatedTransaction) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/${updatedTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(updatedTransaction)
      });
  
      if (response.ok) {
        const updated = await response.json();
        setUserTransactions(prevTransactions => 
          prevTransactions.map(t => t._id === updated._id ? updated : t)
        );
      } else {
        console.error('Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchTransactions();
    }
  }, [user]);

  return { userTransactions, fetchTransactions, deleteTransaction, handleAddTransaction, updateTransaction };
}