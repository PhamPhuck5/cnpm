import api from './axios';

export const login = (data) => {
    return api.post('/api/login', data);
};

export const register = (data) => {
    return api.post('/api/register', data);
};

export const changePassword = (data) => {
    return api.post('/forgot', data);
};

//lấy danh sách các admin(update)