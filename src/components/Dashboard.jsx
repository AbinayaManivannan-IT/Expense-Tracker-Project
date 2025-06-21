// client/src/components/Dashboard.jsx

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import './styles.css';

function Dashboard() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [fixedExpenses, setFixedExpenses] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  useEffect(() => {
    async function fetchData() {
      try {
        const expensesRes = await fetch(`http://localhost:8000/expenses?email=${email}&totExp=true`);
        const expensesData = await expensesRes.json();
        setTotalExpenses(expensesData.totalExp || 0);
        //const savingsSum = expensesData.savings?.reduce((acc, item) => acc + (item.savings || 0), 0);
        setTotalSavings(expensesData.savings||0);
        setDailyLimit(expensesData.dailyLt||0);
        const userRes = await fetch(`http://localhost:8000/users?email=${email}`);
        const userData = await userRes.json();
        const totalFixedExpenses = userData[0].fixedExpenses
          ? userData[0].fixedExpenses.reduce((acc, item) => {
              const amount = Object.values(item)[0];  // Get the value (amount) inside each object
              return acc + amount;
            }, 0)
          : 0;
        console.log(userData.fixedExpenses);
        setFixedExpenses(totalFixedExpenses);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [email]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Hello {name}!</h1>
        <h1>Track you expenses like you've never done before!</h1>
        <div className="stats">
          <div className="stat-card">
            <h3>Total Expenses</h3>
            <p>₹ {totalExpenses}</p>
          </div>
          <div className="stat-card">
            <h3>Total Savings</h3>
            <p>₹ {totalSavings}</p>
          </div>
          <div className="stat-card">
            <h3>Fixed Expenses</h3>
            <p>₹ {fixedExpenses > 0 ? fixedExpenses : 'No fixed expenses available'}</p>
          </div>
          <div className="stat-card">
            <h3>Daily Limit</h3>
            <p>₹ {dailyLimit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
