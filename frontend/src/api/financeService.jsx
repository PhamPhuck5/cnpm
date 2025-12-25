import api from './axios';

// ==================== HÓA ĐƠN (Bills) ====================
// 1. Tạo đợt thu/Hóa đơn (Create Bill)
export const createBill = (data) => {
    return api.post('/api/bills', data);
};

// 2. Lấy hóa đơn của căn hộ (User xem)
export const getMyApartmentBills = () => {
    return api.get('/api/bills/my-apartment');
};

// 3. Lấy chi tiết hóa đơn (Admin xem để thu tiền)
export const getBillById = (id) => {
    return api.get(`/api/bills/${id}`);
};

// ==================== THANH TOÁN (Payments) ====================
// 4. Thực hiện thu tiền (Payment)
export const createPayment = (data) => {
    return api.post('/api/payments', data);
};

// 5. Lịch sử thanh toán của 1 hóa đơn
export const getPaymentsByBill = (billId) => {
    return api.get(`/api/payments/bill-list/${billId}`);
};

// 6. Thống kê thanh toán của hóa đơn (Đã trả bao nhiêu/Còn nợ bao nhiêu)
export const getPaymentStats = (billId) => {
    return api.get(`/api/payments/stats/${billId}`);
};

// ==================== KHOẢN THU KHÁC (Placeholder) ====================
// 7. Thu quỹ đóng góp tự nguyện (Chờ Backend)
export const createDonation = (data) => {
    // return api.post('/api/donations', data);
    console.warn("Backend chưa có API Donation");
    return Promise.resolve({});
};