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

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/expenses?_id=${_id}`);
      fetchData(); // Refresh after deletion
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  return (
    <div className="my-expenses-container">
      <Sidebar />
      <div className="my-expenses-content">
      {violationMessage && (
          <div className="violation-popup">
            <p>{violationMessage}</p>
          </div>
        )}
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
                <p><b>Date: </b>{new Date(expense.date).toLocaleDateString()}</p>
                <button className="delete-btn" onClick={() => handleDelete(expense._id)}>🗑️ Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* {violationMessage && (
          <div className="violation-popup">
            <p>{violationMessage}</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MyExpenses;
