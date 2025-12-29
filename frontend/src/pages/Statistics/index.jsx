import React, { useEffect, useState } from 'react';
import { getDashboardStats, getRevenueStats } from '../../api/statsService';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);

    const [overview, setOverview] = useState({
        totalHouseholds: 0, // Tổng số hộ đang ở
        totalResidents: 0,  // Tổng nhân khẩu
        expectedRevenue: 0,
        actualRevenue: 0, 
        debt: 0             
    });
    
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [resOverview, resRevenue] = await Promise.all([
                    getDashboardStats(),
                    getRevenueStats()
                ]);
                
                // Backend: { totalHouseholds, totalResidents, expectedRevenue, actualRevenue, debt }
                if (resOverview.data?.data) {
                    setOverview(resOverview.data.data);
                }

                if (resRevenue.data?.data) {
                    setRevenueData(resRevenue.data.data);
                }

            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    // Hàm format tiền tệ VNĐ
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-blue-600 font-bold">
            ⏳ Đang tải dữ liệu thống kê...
        </div>
    );

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">📊 Dashboard Quản Lý</h1>

            {/* 1. KPI Cards - Hiển thị 4 thông số chính từ Backend */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Card 1: Tổng số hộ (totalHouseholds) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Số Hộ Đang Ở</p>
                            <p className="text-3xl font-bold text-gray-800">{overview.totalHouseholds}</p>
                        </div>
                        <span className="text-2xl bg-blue-100 p-2 rounded-lg">🏠</span>
                    </div>
                </div>

                {/* Card 2: Tổng nhân khẩu (totalResidents) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Tổng Nhân Khẩu</p>
                            <p className="text-3xl font-bold text-gray-800">{overview.totalResidents}</p>
                        </div>
                        <span className="text-2xl bg-green-100 p-2 rounded-lg">👥</span>
                    </div>
                </div>

                {/* Card 3: Dự kiến thu (expectedRevenue) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Dự Kiến Thu</p>
                            <p className="text-2xl font-bold text-gray-800">{formatMoney(overview.expectedRevenue)}</p>
                        </div>
                        <span className="text-2xl bg-yellow-100 p-2 rounded-lg">📋</span>
                    </div>
                </div>

                {/* Card 4: Thực thu (actualRevenue) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-600 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Thực Tế Đã Thu</p>
                            <p className="text-2xl font-bold text-indigo-700">{formatMoney(overview.actualRevenue)}</p>
                            {/* Hiển thị thêm số nợ nhỏ ở dưới */}
                            <p className="text-xs text-red-500 mt-1 font-semibold">
                                (Còn nợ: {formatMoney(overview.debt)})
                            </p>
                        </div>
                        <span className="text-2xl bg-indigo-100 p-2 rounded-lg">💰</span>
                    </div>
                </div>
            </div>

            {/* 2. Charts Section - Chỉ giữ lại BarChart vì đủ dữ liệu */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
                    📈 Tình hình thu phí (3 tháng gần nhất)
                </h3>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tickFormatter={(val) => new Intl.NumberFormat('en', { notation: "compact" }).format(val)} 
                            />
                            <Tooltip formatter={(value) => formatMoney(value)} cursor={{ fill: '#F3F4F6' }} />
                            <Legend />
                            <Bar dataKey="collected" name="Đã thu" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={50} />
                            <Bar dataKey="debt" name="Còn nợ" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;