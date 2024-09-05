import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, parseISO } from 'date-fns';

export const useMonthNavigation = (transactions = []) => {
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const filtered = transactions.filter(transaction => 
        transaction.date && transaction.date.startsWith(currentMonth)
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions([]);
    }
  }, [transactions, currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => format(subMonths(parseISO(`${prevMonth}-01`), 1), 'yyyy-MM'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => format(addMonths(parseISO(`${prevMonth}-01`), 1), 'yyyy-MM'));
  };

  return { currentMonth, filteredTransactions, handlePreviousMonth, handleNextMonth };
};