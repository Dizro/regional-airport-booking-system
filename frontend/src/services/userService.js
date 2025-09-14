import api from './api';

const getProfile = () => api.get('/api/users/profile');
const updateProfile = (data) => api.put('/api/users/profile', data);
const getAllUsers = () => api.get('/api/users');
const searchUsers = (query) => api.get(`/api/users/search?query=${query}`);
const updateUser = (id, data) => api.put(`/api/users/${id}`, data);
const deleteUser = (id) => api.delete(`/api/users/${id}`);

const userService = {
  getProfile,
  updateProfile,
  getAllUsers,
  searchUsers,
  updateUser,
  deleteUser,
};

export default userService;