import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarLogout.css';

export default function NavbarLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/home');
  };

  return (
    <div className="navbar-logout">
      <button onClick={handleLogout} className="logout-button">🔓 Logout</button>
    </div>
  );
}
