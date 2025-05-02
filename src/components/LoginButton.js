// src/components/LoginButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './LoginButton.css';

export default function LoginButton() {
  return (
    <div className="login-button-container">
      <Link to="/login" className="login-link">Login</Link>
    </div>
  );
}
