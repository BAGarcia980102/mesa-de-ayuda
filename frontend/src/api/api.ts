import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const api = {
  requests: {
    getAll: () => axios.get(`${API_URL}/requests`),
    getTechnicians: async () => {
      try {
        const response = await axios.get(`${API_URL}/technicians`);
        // Verificar que la respuesta es un array
        if (!Array.isArray(response.data)) {
          throw new Error('La respuesta no es un array válido');
        }
        return response.data;
      } catch (error) {
        console.error('Error en API:', error);
        throw error;
      }
    },
    getByTechnicianId: async (technicianId: number) => {
      try {
        const response = await axios.get(`${API_URL}/requests/technician/${technicianId}`);
        return response.data;
      } catch (error) {
        console.error('Error en API getByTechnicianId:', error);
        throw error;
      }
    },
    updateStatus: async (id: number, status: string) => {
      try {
        const response = await axios.put(`${API_URL}/requests/${id}/status`, { status });
        return response.data;
      } catch (error) {
        console.error('Error actualizando estado:', error);
        throw error;
      }
    },
    updateStatusByLocation: async (id: number, latitude: number, longitude: number) => {
      try {
        const response = await axios.put(`${API_URL}/requests/${id}/auto-status`, { latitude, longitude });
        return response.data;
      } catch (error) {
        console.error('Error en actualización automática:', error);
        throw error;
      }
    }
  }
};
