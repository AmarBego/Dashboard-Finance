import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeVsExpense = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const data = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Amount',
        data: [totalIncome, totalExpense],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Income vs Expense',
        color: 'rgba(255, 255, 255, 0.87)', // Light text for dark mode
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.formattedValue}`
        }
      }
    },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default IncomeVsExpense;