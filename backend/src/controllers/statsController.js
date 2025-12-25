import statsService from "../services/statsService";

async function getDashboardData(req, res) {
    try {
        const overview = await statsService.getDashboardOverview();
        return res.status(200).json({ data: overview });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getRevenueChart(req, res) {
    try {
        const chartData = await statsService.getRevenueStats();
        return res.status(200).json({ data: chartData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default {
    getDashboardData,
    getRevenueChart
};