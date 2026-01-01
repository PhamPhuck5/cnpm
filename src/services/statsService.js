import db from "../models/index.js";
import { Op } from "sequelize";

// 1. Lấy số liệu KPI tổng quan
async function getDashboardOverview() {
    try {
        // 1. Tổng số hộ: Chỉ đếm những hộ có leave_date là NULL (chưa chuyển đi)
        const totalHouseholds = await db.Household.count({
            where: {
                leave_date: null
            }
        });

        // 2. Tổng nhân khẩu: (Giữ nguyên logic đã sửa trước đó)
        const totalResidents = await db.Human.count({
            where: {
                living: true
            },
            include: [
                {
                    model: db.Household,
                    where: { leave_date: null },
                    required: true 
                }
            ]
        });

        // --- 🔥 SỬA LOGIC TÍNH TIỀN TẠI ĐÂY ---

        // 3. Dự kiến thu = Tổng số tiền YÊU CẦU (require) từ tất cả các payment
        // (Thay vì lấy từ Bill, ta lấy từ Payment.require)
        const expectedRevenue = await db.Payment.sum('require') || 0;

        // 4. Thực tế thu = Tổng số tiền ĐÃ ĐÓNG (amount)
        const actualRevenue = await db.Payment.sum('amount') || 0;

        // 5. Công nợ
        const debt = expectedRevenue - actualRevenue;

        return {
            totalHouseholds,
            totalResidents,
            expectedRevenue,
            actualRevenue,
            debt
        };
    } catch (error) {
        console.error("Lỗi service overview:", error);
        throw error;
    }
}

async function getRevenueStats() {
    try {
        const data = [];
        const today = new Date();

        for (let i = 2; i >= 0; i--) {
            let month = today.getMonth() + 1 - i;
            let year = today.getFullYear();

            if (month <= 0) {
                month += 12;
                year -= 1;
            }

            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0); 
            
            const collected = await db.Payment.sum('amount', {
                where: {
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }) || 0;

            const expected = await db.Payment.sum('require', {
                include: [{
                    model: db.Bill,
                    where: {
                        start_date: {
                            [Op.between]: [startDate, endDate]
                        }
                    },
                    attributes: [] // Không cần lấy dữ liệu bill, chỉ để filter
                }]
            }) || 0;

            data.push({
                month: `T${month}/${year}`,
                collected: collected,
                debt: expected - collected < 0 ? 0 : expected - collected
            });
        }
        return data;

    } catch (error) {
        console.error("Lỗi service chart:", error);
        throw error;
    }
}

export default {
    getDashboardOverview,
    getRevenueStats
};