import api from './axios';

export const getDashboardStats = () => {
    return api.get('/api/stats/overview');
};

export const getRevenueStats = () => {
    return api.get('/api/stats/revenue');
};