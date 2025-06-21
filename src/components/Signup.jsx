import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salary, setSalary] = useState('');
  const [savings, setSavings] = useState('');
  const [salaryCreditDate, setSalaryCreditDate] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState([]);

  const [expenseKey, setExpenseKey] = useState('');
  const [expenseValue, setExpenseValue] = useState('');
  const navigate = useNavigate();
  const addExpense = () => {
    if (expenseKey && expenseValue) {
      const newExpense = { [expenseKey]: Number(expenseValue) };
      setFixedExpenses([...fixedExpenses, newExpense]);
      setExpenseKey('');
      setExpenseValue('');
    }
  };

  const removeExpense = (index) => {
    const updated = [...fixedExpenses];
    updated.splice(index, 1);
    setFixedExpenses(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const salaryCreditDateObject = new Date(currentDate.getFullYear(), currentDate.getMonth(), salaryCreditDate);

    let url = `http://localhost:8000/users`; 
    const params = {};

    // If the salary credit date is before today, prompt for currentAmount
    if (salaryCreditDateObject != currentDate) {
      const currentAmount = prompt("Please enter your current amount");
      if (currentAmount) {
        params.currentAmount = currentAmount;
        url += `?currentAmount=${currentAmount}`;
      }
    }

    try {
      const res = await axios.post(url, {
        name,
        email,
        password,
        salary: Number(salary),
        savings: Number(savings),
        salaryCreditDate: Number(salaryCreditDate),
        fixedExpenses,
      });
      alert('Signup successful!');
      navigate('/dashboard');
      const ubudget = await axios.get(`http://localhost:8000/budget?email=${email}`);
      const ubudgetj = ubudget.data;
      localStorage.setItem("name",name);
      localStorage.setItem("email",email);
      localStorage.setItem("dailyLt",ubudgetj.dailyLt);
    } catch (err) {
      console.error(err);
      alert('Signup failed.');
    }
  };

  return (
    <div className="form-style">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <br/>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <br/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <br/>
        <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Monthly Salary" required />
        <input type="number" value={savings} onChange={(e) => setSavings(e.target.value)} placeholder="Savings (%)" required />
        <input type="number" value={salaryCreditDate} onChange={(e) => setSalaryCreditDate(e.target.value)} placeholder="Salary Credit Date (e.g. 5)" required />
        <br/>
        <h4>Add Fixed Expenses</h4>
        <input value={expenseKey} onChange={(e) => setExpenseKey(e.target.value)} placeholder="Expense Name (e.g. rent)" />
        <input type="number" value={expenseValue} onChange={(e) => setExpenseValue(e.target.value)} placeholder="Amount" />
        <button type="button" onClick={addExpense}>Add</button>

        <div className='expenses'>
          {fixedExpenses.map((exp, i) => {
            const [key, value] = Object.entries(exp)[0];
            return (
              <li key={i}>
                {key}: ₹{value}
                <button type="button" onClick={() => removeExpense(i)}>❌</button>
              </li>
            );
          })}
        </div>
        <br/>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
