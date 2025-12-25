import db from "../models"; // Import models của bạn
const { Op } = require("sequelize");

// 1. Lấy số liệu KPI tổng quan
async function getDashboardOverview() {
    // Đếm tổng căn hộ
    const totalApartments = await db.Apartment.count();

    // Đếm tổng nhân khẩu đang ở (living: true)
    const totalResidents = await db.Human.count({
        where: { living: true }
    });

    // Tính tổng tiền dự kiến thu (Tất cả hóa đơn trong tháng hiện tại)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const expectedRevenue = await db.Bill.sum('total', {
        where: {
            month: currentMonth,
            year: currentYear
        }
    }) || 0;

    // Tính tổng tiền thực thu (Tổng payment trong tháng)
    // Lưu ý: Logic này đơn giản hóa, thực tế có thể cần query bảng Payment
    const actualRevenue = await db.Bill.sum('total', {
        where: {
            month: currentMonth,
            year: currentYear,
            status: 'Paid' // Hoặc check bảng Payment
        }
    }) || 0;

    return {
        totalApartments,
        totalResidents,
        expectedRevenue,
        actualRevenue
    };
}

// 2. Lấy dữ liệu biểu đồ doanh thu (3 tháng gần nhất)
async function getRevenueStats() {
    // Logic này query 3 tháng gần nhất, group by tháng
    // Đây là code giả lập logic query phức tạp, bạn có thể tinh chỉnh theo SQL
    const currentMonth = new Date().getMonth() + 1;
    const data = [];

    for (let i = 2; i >= 0; i--) {
        let m = currentMonth - i;
        if (m <= 0) m += 12; // Xử lý qua năm
        
        const collected = await db.Bill.sum('total', {
            where: { month: m, status: 'Paid' }
        }) || 0;

        const debt = await db.Bill.sum('total', {
            where: { month: m, status: 'Unpaid' }
        }) || 0;

        data.push({
            month: `Tháng ${m}`,
            collected,
            debt
        });
    }
    return data;
}

// 3. Tỷ lệ lấp đầy
async function getOccupancyStats() {
    // Đếm số hộ khẩu đang hoạt động (có người ở)
    const occupied = await db.Household.count({
        where: { 
            // Điều kiện để coi là đang ở, ví dụ chưa có ngày chuyển đi hoặc living members > 0
            // Tạm thời đếm số record trong bảng Household
        }
    });
    
    const totalApts = await db.Apartment.count();
    const empty = totalApts - occupied;

    return [
        { name: 'Đang ở', value: occupied },
        { name: 'Trống', value: empty > 0 ? empty : 0 }
    ];
}

export default {
    getDashboardOverview,
    getRevenueStats,
    getOccupancyStats
};