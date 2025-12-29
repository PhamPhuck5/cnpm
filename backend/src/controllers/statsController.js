import statsService from "../services/statsService.js"; // Nhớ thêm .js nếu dùng ES Modules

async function getDashboardData(req, res) {
    try {
        const overview = await statsService.getDashboardOverview();
        
        // Trả về đúng cấu trúc frontend mong đợi { data: { totalHouseholds... } }
        return res.status(200).json({ 
            message: "Success",
            data: overview 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

async function getRevenueChart(req, res) {
    try {
        const chartData = await statsService.getRevenueStats();
        
        return res.status(200).json({ 
            message: "Success",
            data: chartData 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export default {
    getDashboardData,
    getRevenueChart
};