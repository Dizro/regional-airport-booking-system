import api from './api';

const getBookings = (params = {}) => api.get('/api/bookings', { params });
const getBookingById = (id) => api.get(`/api/bookings/${id}`);
const createBooking = (data) => api.post('/api/bookings', data);
const updateBooking = (id, data) => api.put(`/api/bookings/${id}`, data);
const requestCancelBooking = (id) => api.put(`/api/bookings/${id}/request-cancellation`);
const processCancellation = (id, action) => api.put(`/api/bookings/${id}/process-cancellation`, { action });
const forceCancelBooking = (id) => api.put(`/api/bookings/${id}/force-cancel`);

const bookingService = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  requestCancelBooking,
  processCancellation,
  forceCancelBooking,
};

export default bookingService;