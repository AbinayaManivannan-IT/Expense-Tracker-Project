import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './styles.css';

const EditProfile = () => {
  const [profile, setProfile] = useState(null);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/users?email=${email}`);
      const userData = res.data[0];
      setProfile(userData);
      setFixedExpenses(userData.fixedExpenses || []);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFixedExpenseChange = (index, key, value) => {
    const updatedExpenses = [...fixedExpenses];
    const expenseKey = Object.keys(updatedExpenses[index])[0];
    updatedExpenses[index] = { [key]: parseInt(value) || 0 };
    setFixedExpenses(updatedExpenses);
  };

  const addFixedExpense = () => {
    setFixedExpenses([...fixedExpenses, { "": 0 }]);
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...profile,
        fixedExpenses: fixedExpenses.filter(e => Object.keys(e)[0] !== "")
      };
      const res = await axios.patch('http://localhost:8000/users', payload);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Update failed!");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="edit-profile-container">
      <Sidebar />
      <div className="edit-profile-content">
        <h2>Edit Profile</h2>
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={profile.name} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input name="email" value={profile.email} readOnly />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={profile.password} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Salary</label>
          <input name="salary" type="number" value={profile.salary} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Savings</label>
          <input name="savings" type="number" value={profile.savings} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Salary Credit Date</label>
          <input name="salaryCreditDate" type="number" value={profile.salaryCreditDate} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Fixed Expenses</label>
          {fixedExpenses.map((expense, idx) => {
            const key = Object.keys(expense)[0];
            return (
              <div key={idx} className="fixed-expense">
                <input
                  type="text"
                  placeholder="Name"
                  value={key}
                  onChange={e => handleFixedExpenseChange(idx, e.target.value, expense[key])}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={expense[key]}
                  onChange={e => handleFixedExpenseChange(idx, key, e.target.value)}
                />
              </div>
            );
          })}
          <button className="add-btn" onClick={addFixedExpense}>+ Add Fixed Expense</button>
        </div>

        <button className="update-btn" onClick={handleUpdate}>Update Profile</button>
      </div>
    </div>
  );
};

export default EditProfile;
