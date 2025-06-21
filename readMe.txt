{
  "email": "sathya@gmail.com",
  "amount": 300,
  "category": "Food",
  "date": "2025-04-27T00:00:00.000Z",
  "description": "Lunch at restaurant"
}


"date" is just a string in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)

MongoDB will automatically store it as Date type.



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Assuming Sidebar is a global component
import './styles.css'; // CSS file for styling

const MyExpenses = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [dailyLimit, setDailyLimit] = useState(0);
  const [violationMessage, setViolationMessage] = useState('');
  const [updatedDailyLimit, setUpdatedDailyLimit] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const email = localStorage.getItem('email'); // Assuming email is stored in localStorage

  useEffect(() => {
    // Fetch daily limit and recent expenses on component mount
    async function fetchData() {
      try {
        const userDataRes = await axios.get(`http://localhost:8000/expenses?email=${email}`);
        const userBudgetRes = await axios.get(`http://localhost:8000/budget?email=${email}`);
        const userBudget = userBudgetRes.data;
        const userData = userDataRes.data;
        setDailyLimit(userBudget.dailyLt || 0);
        setRecentExpenses(userData.results || []);
        console.log(userData.results);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }
    fetchData();
  }, [email]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const date1 = new Date(date);
    const newExpense = { name, amount, category, description,date:date1, email };
    console.log(amount+" "+dailyLimit);
    // Check if the new expense exceeds the daily limit
    const numericAmount = parseFloat(amount);
    if (numericAmount > dailyLimit) {
      setViolationMessage('You have violated your daily limit for today!');
      alert('violated');
      setTimeout(() => {
        setViolationMessage('');
      }, 4000);
    } else {
      setViolationMessage('');
    }

    try {
      // Add the new expense
      await axios.post('http://localhost:8000/expenses', newExpense);
      
      // Update the daily limit if violated
      if (amount > dailyLimit) {
        // Update the daily limit logic (this might require an additional API or logic on backend)
        const newDailyLimit = dailyLimit - amount;
        setUpdatedDailyLimit(newDailyLimit);
        await axios.put('http://localhost:8000/users', { email, dailyLt: newDailyLimit }); // Update on backend
      }

      // Refresh recent expenses after adding a new expense
      const expensesRes = await axios.get(`http://localhost:8000/expenses?email=${email}`);
      setRecentExpenses(expensesRes.data);

      // Clear the form
      setName('');
      setAmount('');
      setCategory('');
      setDescription('');
      setDate('');
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  return (
    <div className="my-expenses-container">
      <Sidebar /> {/* Sidebar component */}
      <div className="my-expenses-content">
        <h1>My Expenses</h1>
        <div className="expense-form">
          <h2>Add New Expense</h2>
          <form onSubmit={handleAddExpense}>
            <input
              type="text"
              placeholder="Expense Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <button type="submit">Add Expense</button>
          </form>
        </div>

        {/* Daily Limit Violation Pop-up */}
        {violationMessage && (
          <div className="violation-popup">
            <p>{violationMessage}</p>
          </div>
        )}

        {/* Show the recent 10 expenses */}
        <div className="recent-expenses">
          <h3>Last 10 Expenses</h3>
          {recentExpenses.slice(0, 10).map((expense, index) => (
            <div key={index} className="expense-card">
              <h4>{expense.name}</h4>
              <p>₹ {expense.amount}</p>
              <p>{expense.category}</p>
              <p>{expense.description}</p>
              <p>{expense.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyExpenses;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Assuming Sidebar is a global component
import './styles.css'; // CSS file for styling

const MyExpenses = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
 // const [dailyLimit, setDailyLimit] = useState(0);
  const [violationMessage, setViolationMessage] = useState('');
  const [updatedDailyLimit, setUpdatedDailyLimit] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
  const dailyLimit = localStorage.getItem('dailyLt');
  useEffect(() => {
    // Fetch daily limit and recent expenses on component mount
    async function fetchData() {
      try {
        const userDataRes = await axios.get(`http://localhost:8000/expenses?email=${email}`);
        //const userBudgetRes = await axios.get(`http://localhost:8000/budget?email=${email}`);
        //const userBudget = userBudgetRes.data;
        const userData = userDataRes.data;
        //setDailyLimit(userBudget.dailyLt || 0);
        setRecentExpenses(userData.results || []);
        console.log(userData.results);
        console.log("Daily limit"+dailyLimit);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }
    fetchData();
  }, [email]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const date1 = new Date(date);
    const newExpense = { name, amount, category, description,date:date1, email };
    console.log(amount+" "+dailyLimit);
    // Check if the new expense exceeds the daily limit
    const numericAmount = parseFloat(amount);
    if (numericAmount > dailyLimit) {
      setViolationMessage('You have violated your daily limit for today!');
      alert('violated');
      setTimeout(() => {
        setViolationMessage('');
      }, 4000);
    } else {
      setViolationMessage('');
    }

    try {
      // Add the new expense
      await axios.post('http://localhost:8000/expenses', newExpense);
      
      // Update the daily limit if violated
      if (amount > dailyLimit) {
        // Update the daily limit logic (this might require an additional API or logic on backend)
        const newDailyLimit = 0;
        setUpdatedDailyLimit(newDailyLimit);
        //await axios.put('http://localhost:8000/users', { email, dailyLt: newDailyLimit }); // Update on backend
      }

      // Refresh recent expenses after adding a new expense
      const expensesRes = await axios.get(`http://localhost:8000/expenses?email=${email}`);
      setRecentExpenses(expensesRes.data.results);

      // Clear the form
      setName('');
      setAmount('');
      setCategory('');
      setDescription('');
      setDate('');
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  return (
    <div className="my-expenses-container">
      <Sidebar /> {/* Sidebar component */}
      <div className="my-expenses-content">
        <h1>My Expenses</h1>
        <div className="expense-form">
          <h2>Add New Expense</h2>
          <form onSubmit={handleAddExpense}>
            <input
              type="text"
              placeholder="Expense Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <button type="submit">Add Expense</button>
          </form>
        </div>

        {/* Daily Limit Violation Pop-up */}
        {violationMessage && (
          <div className="violation-popup">
            <p>{violationMessage}</p>
          </div>
        )}

        {/* Show the recent 10 expenses */}
        <div className="recent-expenses">
          <h3>Last 10 Expenses</h3>
          {recentExpenses.slice(0, 10).map((expense, index) => (
            <div key={index} className="expense-card">
              <h4>{expense.name}</h4>
              <p>₹ {expense.amount}</p>
              <p>{expense.category}</p>
              <p>{expense.description}</p>
              <p>{expense.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyExpenses;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './styles.css';

const MyExpenses = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [violationMessage, setViolationMessage] = useState('');
  const [updatedDailyLimit, setUpdatedDailyLimit] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);

  const email = localStorage.getItem('email');
  const dailyLimit = localStorage.getItem('dailyLt');

  // Filter states
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, [email]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/expenses?email=${email}`);
      const sortedData = res.data.results.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentExpenses(sortedData.slice(0, 10));
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const date1 = new Date(date);
    const newExpense = { name, amount, category, description, date: date1, email };
    const numericAmount = parseFloat(amount);

    if (numericAmount > dailyLimit) {
      setViolationMessage('You have violated your daily limit for today!');
      alert('violated');
      setTimeout(() => {
        setViolationMessage('');
      }, 4000);
    } else {
      setViolationMessage('');
    }

    try {
      await axios.post('http://localhost:8000/expenses', newExpense);
      if (amount > dailyLimit) {
        setUpdatedDailyLimit(0);
      }
      fetchData();
      setName('');
      setAmount('');
      setCategory('');
      setDescription('');
      setDate('');
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setFilterValue('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
  };

  const handleFilter = async () => {
    try {
      let url = `http://localhost:8000/expenses?email=${email}`;

      if (filterType === 'category') {
        url += `&category=${filterValue}`;
      } else if (filterType === 'date') {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      } else if (filterType === 'amount') {
        url += `&minAmt=${minAmount}&maxAmt=${maxAmount}`;
      }

      const res = await axios.get(url);
      const sortedFiltered = res.data.results.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentExpenses(sortedFiltered.slice(0, 10));
    } catch (err) {
      console.error("Error filtering expenses:", err);
    }
  };

  return (
    <div className="my-expenses-container">
      <Sidebar />
      <div className="my-expenses-content">
        <h1>My Expenses</h1>
        <div className="expenses-main">
          <div className="expense-form">
            <h2>Add New Expense</h2>
            <form onSubmit={handleAddExpense}>
              <input type="text" placeholder="Expense Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
              <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              <button type="submit">Add Expense</button>
            </form>
          </div>

          <div className="recent-expenses">
            <h3>Last 10 Expenses</h3>
            <div className="filter-section">
              <select value={filterType} onChange={handleFilterTypeChange}>
                <option value="">Select Filter</option>
                <option value="category">Category</option>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>

              {filterType === 'category' && (
                <input type="text" placeholder="Enter Category" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
              )}

              {filterType === 'date' && (
                <>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </>
              )}

              {filterType === 'amount' && (
                <>
                  <input type="number" placeholder="Min Amount" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                  <input type="number" placeholder="Max Amount" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
                </>
              )}

              <button onClick={handleFilter}>∇</button>
            </div>

            {recentExpenses.map((expense, index) => (
              <div key={index} className="expense-card">
                <h4>{expense.name}</h4>
                <p><b>Amount: </b>₹ {expense.amount}</p>
                <p><b>Category: </b>{expense.category}</p>
                <p><b>Description: </b>{expense.description}</p>
                <p><b>Date: </b>{expense.date}</p>
              </div>
            ))}
          </div>
        </div>

        {violationMessage && (
          <div className="violation-popup">
            <p>{violationMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyExpenses;




import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';
import Sidebar from './Sidebar';
import './styles.css';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend);

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
      setFixedExpenses(fixedRes.data.fixedExpenses || 0);
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
          <div className="chart-box">
            <h3>Date vs Expense Amount</h3>
            <Line data={lineChartData} />
          </div>

          <div className="chart-box">
            <h3>Category Wise Expenditure</h3>
            <Pie data={pieChartData} />
          </div>

          <div className="chart-box">
            <h3>Expense Overview</h3>
            <Bar data={barChartData} />
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

