import { Link } from "react-router-dom";
import './styles.css';

function Sidebar() {
  const name = localStorage.getItem("name");

  return (
    <div className="sidebar">
      <h2>{name}</h2>
      <nav>
        <ul>
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/myexpenses">My Expenses</Link></li>
          <li><Link to="/report">Report</Link></li>
          <li><Link to="/editprofile">Edit Profile</Link></li>
          <li><Link to="/login">Sign Out</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
