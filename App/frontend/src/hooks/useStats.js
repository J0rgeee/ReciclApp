import { useState, useEffect } from 'react';
import axios from 'axios';

const useStats = () => {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalPuntosVerdes: 0,
    totalPublicaciones: 0,
    pesosPorTipo: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/admin/stats/', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.cookie.split('csrftoken=')[1]?.split(';')[0]
          }
        });
        setStats(response.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Error al cargar las estadísticas');
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useStats;