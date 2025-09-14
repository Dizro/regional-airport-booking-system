import api from './api';

const login = (data) => api.post('/api/auth/login', data);
const register = (data) => api.post('/api/auth/register', data);

const authService = {
    login,
    register,
};

export default authService;