import api from './axios';

export const login = (data) => {
    return api.post('/api/login', data);
};

export const register = (data) => {
    return api.post('/api/register', data);
};