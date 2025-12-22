import api from './axios';

export const getMyHouseholds = async () => {
    // Postman: GET /api/households (Lấy danh sách theo User)
    const response = await api.get('/api/households');
    return response.data;
};

export const createHousehold = async (data) => {
    // Postman: POST /api/households/create
    // Body: { room, number_motobike, number_car }
    const response = await api.post('/api/households/create', data);
    return response.data;
};

export const getHouseholdDetail = async (id) => {
    // Postman: GET /api/households/:id
    const response = await api.get(`/api/households/${id}`);
    return response.data;
};