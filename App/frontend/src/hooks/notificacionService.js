import axios from 'axios';

const getCsrfToken = () => {
    const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : null;
  };

const BASE_URL = 'http://localhost:8000/api/notificaciones';

const notificacionService = {
  listar: async () => {
    try {
      const response = await axios.get(BASE_URL + '/');
      return response.data;
    } catch (error) {
      console.error('Error al listar notificaciones:', error);
      throw error;
    }
  },

  eliminar: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}/`, {
        headers: {
            'X-CSRFToken': getCsrfToken(),
        }
      });
      return true;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  },

  toggleLeido: async (id) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${id}/toggle_leido/`, {}, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado de notificación:', error);
      throw error;
    }
  },

  crear: async (data) => {
    try {
      const response = await axios.post(BASE_URL + '/', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw error;
    }
  }
};

export default notificacionService;