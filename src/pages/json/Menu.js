import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import '../CSS/Menu.css';

export default function Menu() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const [dashboardData, setDashboardData] = useState(null);


  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  useEffect(() => {
  if (user) {
    fetch(`http://localhost:5000/api/emotion/dashboard/${user.id}`)
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(err => console.error('Error al cargar estadísticas:', err));
  }
}, [user]);

  // Maneja selección de imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    } else {
      alert('Por favor selecciona un archivo de imagen válido.');
    }
  };

  // Abre el selector de archivos
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Realiza el análisis con AWS Rekognition a través del backend
  const handleSearch = async () => {
    if (!selectedImage) {
      return alert('Primero selecciona una imagen.');
    }

    // Creamos un FormData y agregamos la imagen
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // Llamada al endpoint /api/emotion/analyze
      const response = await fetch('http://localhost:5000/api/emotion/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        return alert(data.error || 'Error al analizar la imagen.');
      }

      // data.emotions es un arreglo de emociones detectadas, por ejemplo: ["Happy", "Surprised"]
      console.log('Emociones detectadas:', data.emotions);

      // Convertimos la imagen a URL para mostrarla en Busqueda.js
      const imageUrl = URL.createObjectURL(selectedImage);

      // Guardamos el resultado del análisis en localStorage para usarlo en /busqueda
      localStorage.setItem('analysisResult', JSON.stringify({
        imageUrl,
        emotions: data.emotions
      }));

      // Luego, consultamos las canciones recomendadas (desde el backend)
      // Se espera que el endpoint /api/emotion/songs ya esté configurado
      const songsResponse = await fetch('http://localhost:5000/api/emotion/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotions: data.emotions })
      });

      const songsData = await songsResponse.json();
      if (!songsResponse.ok) {
        return alert(songsData.error || 'Error al obtener recomendaciones.');
      }
      
      // Opcional: Puedes almacenar también las canciones en localStorage si lo deseas
      localStorage.setItem('recommendedSongs', JSON.stringify(songsData.songs));

      // Finalmente, redirigimos a la página /busqueda
      navigate('/busqueda');

      // Si deseas guardar el análisis en historial, puedes llamarlo aquí.
      // Por ejemplo, podrías hacer una llamada al endpoint `/api/emotion/save`
      // pasando la imagen, user.id, emociones y el id de las canciones.
      // Eso lo haremos en el endpoint /api/emotion/save en el backend.
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="menu-wrapper">
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
              {/* Usa <Link> si prefieres navegación SPA */}
              <li><a href="/menu">Home</a></li>
              <li><a href="/busqueda">Recomendación</a></li>
              <li><a href="/historial">Historial</a></li>
            </ul>
          </nav>
        </aside>

        <main className="main-section">
          <div className="left-panel">
            <h2>Sincronízate con tus emociones</h2>
            <p>Selecciona una foto o imagen</p>
            <button className="upload-btn" onClick={triggerFileInput}>📤 Subir Imagen</button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="image-preview" >
              {selectedImage ? (
                <img src={URL.createObjectURL(selectedImage)} alt="Vista previa" />
              ) : (
                'No hay imagen seleccionada'
              )}
            </div>
            <button className="search-button" onClick={handleSearch}>
              🔍 Realizar búsqueda
            </button>
          </div>

          <div className="right-panel">
  {dashboardData && (
    <section className="dashboard-section">
      <h2 className="dashboard-title">📊 Dashboard personal</h2>

      <div className="chart-block">
        <p className="chart-label">Tus emociones esta semana:</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={Object.entries(dashboardData.porSemana).map(([emocion, cantidad]) => ({ emocion, cantidad }))}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="emocion" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-block">
        <p className="chart-label">Distribución por emociones este mes:</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={Object.entries(dashboardData.porMes).map(([emocion, cantidad]) => ({ name: emocion, value: cantidad }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              label
            >
              {Object.entries(dashboardData.porMes).map(([_, __], index) => (
                <Cell
                  key={index}
                  fill={[
                    "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51",
                    "#264653", "#A8DADC", "#C1E8E3", "#FFB4A2", "#B5EAD7"
                  ][index % 9]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="total-count">Total de análisis realizados: <strong>{dashboardData.total}</strong></p>
    </section>
  )}
</div>


        </main>
      </div>
    </div>
  );


}
