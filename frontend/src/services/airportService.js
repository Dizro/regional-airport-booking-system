import api from './api';

const getAllAirports = () => api.get('/api/airports');

const airportService = {
  getAllAirports,
};

export default airportService;