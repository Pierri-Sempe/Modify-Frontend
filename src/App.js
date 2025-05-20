import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/json/Home';
import Login from './pages/json/Login';
import Signup from './pages/json/Signup';
import Menu from './pages/json/Menu';
import Busqueda from './pages/json/Busqueda';
import Historial from './pages/json/Historial';
require("./instrument.js");


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/busqueda" element={<Busqueda />} />
          <Route path="/historial" element={<Historial />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
