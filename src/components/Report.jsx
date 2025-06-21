import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import Sidebar from './Sidebar';
import './styles.css';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

const Report = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [fixedExpenses, setFixedExpenses] = useState(0);
  const [savings, setSavings] = useState(0);
  const [budget, setBudget] = useState(0);
  const email = localStorage.getItem('email');
  const printRef = useRef();

  useEffect(() => {
    fetchAllData();
  }, [email]);

  const fetchAllData = async () => {
    try {
      const [expenseRes, fixedRes, budgetRes, totalRes] = await Promise.all([
        axios.get(`http://localhost:8000/expenses?email=${email}`),
        axios.get(`http://localhost:8000/users?email=${email}`),
        axios.get(`http://localhost:8000/budget?email=${email}`),
        axios.get(`http://localhost:8000/expenses?email=${email}&totExp=true`)
      ]);

      setExpenses(expenseRes.data.results);
      const user = fixedRes.data[0];
      if (user && Array.isArray(user.fixedExpenses)) {
        const fixedSum = user.fixedExpenses.reduce((sum, obj) => {
          const value = Object.values(obj)[0];
          return sum + (typeof value === 'number' ? value : 0);
        }, 0);
        setFixedExpenses(fixedSum);
      }

      setSavings(budgetRes.data.savingsAmt || 0);
      setBudget(budgetRes.data.budget || 0);
      setTotalExpenses(totalRes.data.totalExp || 0);
    } catch (err) {
      console.error("Error fetching report data:", err);
    }
  };

  // Chart 1: Line chart (date vs amount)
  const lineChartData = {
    labels: expenses.map(e => new Date(e.date).toLocaleDateString()),
    datasets: [{
      label: 'Expense Amounts by Date',
      data: expenses.map(e => e.amount),
      fill: false,
      borderColor: '#a013a0',
      backgroundColor: '#a013a0',
      tension: 0.3
    }]
  };

  // Chart 2: Pie chart (category-wise)
  const categoryMap = {};
  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  const pieChartData = {
    labels: Object.keys(categoryMap),
    datasets: [{
      label: 'Category-wise Spending',
      data: Object.values(categoryMap),
      backgroundColor: [
        '#a013a0', '#f67280', '#c06c84', '#6c5b7b', '#355c7d'
      ]
    }]
  };

  // Chart 3: Bar chart (total, fixed, savings)
  const barChartData = {
    labels: ['Total Expenses', 'Fixed Expenses', 'Savings'],
    datasets: [{
      label: 'Amount',
      data: [totalExpenses, fixedExpenses, savings],
      backgroundColor: ['#a013a0', '#c06c84', '#f67280']
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'bottom' } }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-container" ref={printRef}>
      <Sidebar />
      <div className="report-content">
        <h1>Monthly Report</h1>
        <div className="summary-section">
          <div className="summary-card">Total Expenses: ₹{totalExpenses}</div>
          <div className="summary-card">Fixed Expenses: ₹{fixedExpenses}</div>
          <div className="summary-card">Savings: ₹{savings}</div>
          <div className="summary-card">Budget: ₹{budget}</div>
        </div>

        <div className="chart-section">
          <div className="chart-box small-chart">
            <h3>Date vs Expense Amount</h3>
            <div className="chart-wrapper">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-box small-chart">
            <h3>Category Wise Expenditure</h3>
            <div className="chart-wrapper">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-box small-chart">
            <h3>Expense Overview</h3>
            <div className="chart-wrapper">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="print-btn-container">
          <button onClick={handlePrint} className="print-btn">Print Report</button>
        </div>
      </div>
    </div>
  );
};

export default Report;
