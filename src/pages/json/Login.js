import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return alert('Por favor, ingresa tu correo y contraseña');
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // 👉 Aquí guardamos el nombre de usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.username));
        alert(`¡Bienvenido, ${data.username}!`);
        navigate('/menu');
      } else {
        alert(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con el servidor');
    }
  };
  
  return (
    <div className="login-container">
      <h2 className="login-title">Moodify</h2>
      <input type="text" placeholder="Email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  );

}
