import axios from 'axios';

const getCsrfToken = () => {
  const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : null;
};

const BASE_URL = 'http://localhost:8000/api/admin/pesos';

const pesoService = {
  listar: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/`);
      return response.data;
    } catch (error) {
      console.error('Error al listar pesos:', error);
      throw error;
    }
  },

  eliminar: async (id) => {
    if (!id) throw new Error('ID no proporcionado');
    try {
      await axios.delete(`${BASE_URL}/${id}/`, {
        headers: {
          'X-CSRFToken': getCsrfToken(),
        }
      });
      return true;
    } catch (error) {
      console.error('Error al eliminar peso:', error);
      throw error;
    }
  },

  aprobar: async (id) => {
    if (!id) throw new Error('ID no proporcionado');
    try {
      const response = await axios.patch(`${BASE_URL}/${id}/aprobar/`, {}, {
        headers: {
          'X-CSRFToken': getCsrfToken(),
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al aprobar peso:', error);
      throw error;
    }
  },

  desaprobar: async (id) => {
    if (!id) throw new Error('ID no proporcionado');
    try {
      const response = await axios.patch(`${BASE_URL}/${id}/desaprobar/`, {}, {
        headers: {
          'X-CSRFToken': getCsrfToken(),
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al desaprobar peso:', error);
      throw error;
    }
  }
};

export default pesoService;