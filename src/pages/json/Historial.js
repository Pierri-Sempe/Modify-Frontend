import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Historial.css';

const EMOCIONES = [
  'Happy', 'Sad', 'Angry', 'Confused', 'Disgusted', 'Surprised', 'Calm', 'Fear', 'Unknown'
];

export default function Historial() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [historial, setHistorial] = useState([]);
  const [emocionFiltro, setEmocionFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    if (!user) return navigate('/login');

    const query = new URLSearchParams({
      user_id: user.id,
      page: pagina,
      emocion: emocionFiltro
    }).toString();

    fetch(`http://localhost:5000/api/history?${query}`)
      .then(res => res.json())
      .then(data => {
  if (!data || !Array.isArray(data.resultados)) {
    setHistorial([]);         // Evita el .length de undefined
    setTotalPaginas(1);
    return;
  }
  setHistorial(data.resultados);
  setTotalPaginas(data.totalPaginas || 1);
})

      .catch(err => {
        console.error('Error al cargar historial:', err);
        setHistorial([]);
      });
  }, [pagina, emocionFiltro, user, navigate]);

  return (
    <div className="historial-wrapper">
      <div className="topbar">
        <button className="logout-button" onClick={() => {
          localStorage.removeItem('user');
          navigate('/login');
        }}>Logout</button>
      </div>

      <div className="menu-content">
        <aside className="sidebar">
          <h2>Moodify</h2>
          <nav>
            <ul>
              <li><a href="/menu">Home</a></li>
              <li><a href="/recomendaciones">Recomendación</a></li>
              <li><a href="/historial">Historial</a></li>
            </ul>
          </nav>
        </aside>

        <main className="main-section">
          <h1>Historial de recomendaciones</h1>

          <div className="filtro-section">
            <label>Filtrar por emoción:</label>
            <select value={emocionFiltro} onChange={(e) => setEmocionFiltro(e.target.value)}>
              <option value="">Todas</option>
              {EMOCIONES.map((emocion, idx) => (
                <option key={idx} value={emocion}>{emocion}</option>
              ))}
            </select>
          </div>

          {historial.length === 0 ? (
            <p>No hay entradas para mostrar.</p>
          ) : (
            historial.map((entry, index) => (
              <div key={index} className="historial-entry">
                <div className="historial-details">
                  <p><strong>Emociones:</strong> {entry.emociones.join(', ')}</p>
                  <ul>
                    {entry.canciones.map((c, idx) => (
                      <li key={idx}>
                        <strong>{c.titulo}</strong> - {c.artista} ({c.emocion})
                        {c.enlace_spotify && (
                          <a href={c.enlace_spotify} target="_blank" rel="noopener noreferrer"> 🎵</a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}

          <div className="paginacion">
            <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
            <span>Página {pagina} de {totalPaginas}</span>
            <button disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>Siguiente</button>
          </div>
        </main>
      </div>
    </div>
  );
}
