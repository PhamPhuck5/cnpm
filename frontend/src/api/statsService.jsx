import api from './axios';

// 1. Lấy số liệu tổng quan (KPI Cards)
// VD: Tổng số căn, Tổng dân, Tổng thu, Tổng nợ
export const getDashboardOverview = () => {
    // return api.get('/api/stats/overview');
    
    // Giả lập dữ liệu trả về để làm giao diện trước
    return Promise.resolve({
        data: {
            totalApartments: 240,
            totalResidents: 850,
            expectedRevenue: 150000000,
            actualRevenue: 90000000
        }
    });
};

// 2. Biểu đồ tỉ lệ lấp đầy (Pie Chart)
export const getOccupancyStats = () => {
    // return api.get('/api/stats/occupancy');
    return Promise.resolve({
        data: [
            { name: 'Đang ở', value: 200 },
            { name: 'Trống', value: 40 }
        ]
    });
};

// 3. Biểu đồ thu chi theo tháng (Bar Chart)
export const getRevenueStats = () => {
    // return api.get('/api/stats/revenue');
    return Promise.resolve({
        data: [
            { month: 'T1', collected: 4000, debt: 2400 },
            { month: 'T2', collected: 3000, debt: 1398 },
            { month: 'T3', collected: 2000, debt: 9800 },
        ]
    });
};

// 4. Top căn hộ nợ phí (Warning Table)
export const getTopDebtors = () => {
    // return api.get('/api/stats/debtors');
    return Promise.resolve({
        data: [
            { room: '101', owner: 'Nguyễn Văn A', debt: 5000000 },
            { room: '305', owner: 'Trần Thị B', debt: 3200000 },
        ]
    });
};

// 5. Thống kê quỹ đóng góp
export const getDonationStats = () => {
    // return api.get('/api/stats/donations');
    return Promise.resolve({
        data: [
            { name: 'Quỹ vì người nghèo', amount: 5000000 },
            { name: 'Quỹ biển đảo', amount: 2000000 },
        ]
    });
};