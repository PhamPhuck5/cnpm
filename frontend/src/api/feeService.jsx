import api from './axios';

// --- BILLS ---
export const getApartmentBills = async () => {
    // Postman: GET /api/bills/my-apartment
    const response = await api.get('/api/bills/my-apartment');
    return response.data;
};

export const createBill = async (billData) => {
    // Postman: POST /api/bills
    // Body: { email, last_date, based }
    const response = await api.post('/api/bills', billData);
    return response.data;
};

// --- PAYMENTS ---
export const createPayment = async (paymentData) => {
    // Postman: POST /api/payments
    // Body: { household_id, bill_id, amount }
    const response = await api.post('/api/payments', paymentData);
    return response.data;
};

export const getPaymentStats = async (billId) => {
    // Postman: GET /api/payments/stats/:id
    const response = await api.get(`/api/payments/stats/${billId}`);
    return response.data;
};