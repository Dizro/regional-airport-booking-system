import api from './api';

const getAllFlights = (params) => api.get('/api/flights', { params });
const getBookedSeats = (flightId) => api.get(`/api/flights/${flightId}/booked-seats`);
const createFlight = (data) => api.post('/api/flights', data);
const updateFlight = (id, data) => api.put(`/api/flights/${id}`, data);
const deleteFlight = (id) => api.delete(`/api/flights/${id}`);

const flightService = {
    getAllFlights,
    getBookedSeats,
    createFlight,
    updateFlight,
    deleteFlight,
};

export default flightService;