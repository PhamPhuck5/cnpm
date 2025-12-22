import api from './axios';

export const getApartments = () => {
    return api.get('/api/apartments');
};

export const createApartment = (data) => {
    return api.post('/api/apartments', data);
};