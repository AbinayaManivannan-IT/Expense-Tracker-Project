// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// import React from 'react';
// import Signup from './components/Signup';

// function App() {
//   return (
//     <div className="App">
//       <Signup />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs'; // Assuming AboutUs is in pages
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MyExpenses from './components/MyExpenses';
import Report from './components/Report';
import EditProfile from './components/EditProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AboutUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myexpenses" element={<MyExpenses/>}/>
        <Route path="/report" element={<Report/>}/>
        <Route path="/editprofile" element={<EditProfile/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;



