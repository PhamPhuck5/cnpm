import api from './axios';

export const createBill = (data) => {
    return api.post('/api/bills', data);
};

export const getAllBills = () => {
    return api.get('/api/bills/my-apartment');
};

export const getBillDetail = (id) => {
    return api.get(`/api/bills/${id}`);
};

export const updatePayment = (paymentId, data) => {
    return api.put(`/api/payments/update/${paymentId}`, data);
};

export const getBillPayments = (billId) => {
    return api.get(`/api/payments/bill-list/${billId}`);
};

export const getPaymentStats = (billId) => {
    return api.get(`/api/payments/stats/${billId}`);
};

export const createPayment = (data) => {
    return api.post('/api/payments', data);
};

export const deleteBill = (billId) => {
    return api.delete(`/api/bills/${billId}`);
}