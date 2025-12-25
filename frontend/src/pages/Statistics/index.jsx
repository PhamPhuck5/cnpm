import React, { useEffect, useState } from 'react';
import { getDashboardOverview, getRevenueStats } from '../../api/statsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const [overview, setOverview] = useState(null);
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        // Giả lập gọi API (Vì backend statsService đang là placeholder)
        const loadStats = async () => {
            const resOverview = await getDashboardOverview();
            const resRevenue = await getRevenueStats();
            
            setOverview(resOverview.data);
            setRevenueData(resRevenue.data);
        };
        loadStats();
    }, []);

    if (!overview) return <div className="p-10 text-center">Đang tải thống kê...</div>;

    const COLORS = ['#0088FE', '#FF8042'];

    // Dữ liệu biểu đồ tròn giả lập
    const pieData = [
        { name: 'Đang ở', value: 200 },
        { name: 'Trống', value: 40 },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">📊 Tổng Quan Chung Cư BlueMoon</h1>

            {/* 1. KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <p className="text-gray-500 text-xs uppercase font-bold">Tổng căn hộ</p>
                    <p className="text-3xl font-bold text-gray-800">{overview.totalApartments}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-gray-500 text-xs uppercase font-bold">Nhân khẩu</p>
                    <p className="text-3xl font-bold text-gray-800">{overview.totalResidents}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <p className="text-gray-500 text-xs uppercase font-bold">Dự kiến thu</p>
                    <p className="text-2xl font-bold text-gray-800">{overview.expectedRevenue.toLocaleString()} đ</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                    <p className="text-gray-500 text-xs uppercase font-bold">Thực thu</p>
                    <p className="text-2xl font-bold text-gray-800">{overview.actualRevenue.toLocaleString()} đ</p>
                </div>
            </div>

            {/* 2. Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Biểu đồ Doanh thu (Cột) */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Tình hình thu phí 3 tháng gần nhất</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="collected" name="Đã thu" fill="#10B981" />
                                <Bar dataKey="debt" name="Còn nợ" fill="#EF4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Biểu đồ Tỷ lệ lấp đầy (Tròn) */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Tỷ lệ lấp đầy căn hộ</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;