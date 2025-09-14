import api from './api';

const getAllAircrafts = () => api.get('/api/aircrafts');
const createAircraft = (data) => api.post('/api/aircrafts', data);
const updateAircraft = (id, data) => api.put(`/api/aircrafts/${id}`, data);
const deleteAircraft = (id) => api.delete(`/api/aircrafts/${id}`);

const aircraftService = {
  getAllAircrafts,
  createAircraft,
  updateAircraft,
  deleteAircraft,
};

export default aircraftService;