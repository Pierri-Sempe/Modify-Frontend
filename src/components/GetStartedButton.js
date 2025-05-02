// src/components/GetStartedButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GetStartedButton.css';

export default function GetStartedButton() {
  const navigate = useNavigate();

  return (
    <button className="btn" onClick={() => navigate('/signup')}>
      Get started
    </button>
  );
}
