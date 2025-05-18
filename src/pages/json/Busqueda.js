import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../CSS/Menu.css'; // Estilos reutilizados

export default function Busqueda() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [songs, setSongs] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedAnalysis = JSON.parse(localStorage.getItem('analysisResult'));
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedAnalysis || !storedAnalysis.imageUrl || !storedAnalysis.emotions) {
      alert('Primero realiza una búsqueda');
      navigate('/menu');
      return;
    }

    if (!storedUser || !storedUser.id) {
      alert('Sesión expirada. Por favor inicia sesión nuevamente');
      navigate('/login');
      return;
    }

    setImageUrl(storedAnalysis.imageUrl);
    setEmotions(storedAnalysis.emotions);
    setUserId(storedUser.id);

    fetchSongsAndSave(storedAnalysis.emotions, storedUser.id);
  }, []);

  const fetchSongsAndSave = async (emotionsList, userId) => {
    try {
      const response = await fetch('http://localhost:5000/api/emotion/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotions: emotionsList })
      });

      const data = await response.json();

      if (response.ok) {
        setSongs(data.songs);

        // Guardar en historial (sin imagen real, solo referencia simbólica)
        const formData = new FormData();
        const fakeImage = new Blob([''], { type: 'image/jpeg' });

        formData.append('image', fakeImage, 'placeholder.jpg');
        formData.append('user_id', userId);
        formData.append('emotions', JSON.stringify(emotionsList));
        formData.append('songs', JSON.stringify(data.songs.map(s => s.id)));

        await fetch('http://localhost:5000/api/emotion/save', {
          method: 'POST',
          body: formData
        });
      } else {
        alert('No se pudieron obtener canciones');
      }
    } catch (error) {
      console.error('Error al obtener canciones o guardar historial:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const handleNewRecommendations = () => {
    if (emotions.length && userId) {
      fetchSongsAndSave(emotions, userId);
    }
  };

  return (
    <div className="menu-wrapper">
      <div className="topbar">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>

      <div className="menu-content">
        <aside className="sidebar">
          <h2>Moodify</h2>
          <nav>
            <ul>
              <li><Link to="/menu">Home</Link></li>
              <li><Link to="/recomendaciones">Recomendación</Link></li>
              <li><Link to="/historial">Historial</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="main-section">
          {/* Izquierda: imagen y emociones */}
          <div className="left-panel">
            <h2>Resultado de análisis</h2>
            <p>Emociones detectadas: {emotions.join(', ')}</p>
            <div className="image-preview">
              <img src={imageUrl} alt="Subida" />
            </div>
          </div>

          {/* Derecha: canciones */}
          <div className="right-panel">
            <h2>Canciones recomendadas</h2>
            <button onClick={handleNewRecommendations} className="search-button">
              Obtener nuevas recomendaciones
            </button>
            <ul>
              {songs.map((song, index) => (
                <li key={index} style={{ margin: '10px 0' }}>
                  <strong>{song.titulo}</strong> - {song.artista} <br />
                  {song.enlace_spotify && (
                    <a href={song.enlace_spotify} target="_blank" rel="noopener noreferrer">
                      Escuchar en Spotify
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
