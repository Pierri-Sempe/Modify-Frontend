import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Signup.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !username || !password) {
      return alert('Por favor, completa todos los campos');
    }
    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Registro exitoso!');
        navigate('/login');
      } else {
        alert(data.error || 'Error al registrar');
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Moodify</h2>
      <input type="text" placeholder="Email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Username" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="signup-button" onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
