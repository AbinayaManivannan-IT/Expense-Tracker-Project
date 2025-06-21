import React, { useState } from 'react';
import './styles.css';
const ExpenseForm = () => {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
    const newExpense = {
      name: expenseName,
      amount,
      category,
      description,
      date,
      email, // User email to associate the expense
    };

    try {
      const res = await fetch('http://localhost:8000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });

      if (res.ok) {
        alert('Expense added successfully!');
        // Reset form fields after successful submission
        setExpenseName('');
        setAmount('');
        setCategory('');
        setDescription('');
        setDate('');
      } else {
        alert('Failed to add expense');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding expense');
    }
  };

  return (
    <div className="expense-form-container">
      <h3>Add New Expense</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Expense Name:</label>
          <input
            type="text"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
