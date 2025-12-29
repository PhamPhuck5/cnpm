import React, { useEffect, useState } from 'react';
// 👇 SỬA 1: Import hàm lấy danh sách ĐANG SỐNG
import { getLivingHouseholds } from '../../api/managementService';
import { Link } from 'react-router-dom';

const HouseholdList = () => {
    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getLivingHouseholds();
            const dataArray = res.data?.data || res.data || [];
            
            setHouseholds(dataArray);
        } catch (err) {
            console.error("Lỗi tải danh sách hộ:", err);
            alert("Không thể tải danh sách hộ khẩu.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">📋 Danh Sách Hộ Đang Cư Trú</h1>
                    <p className="text-sm text-gray-500">Chỉ hiển thị các hộ đang hiện diện tại tòa nhà</p>
                </div>
                <Link to="/households/create" className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition font-medium">
                    + Thêm Hộ Mới
                </Link>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="bg-blue-50 text-blue-800 uppercase text-xs font-bold tracking-wider text-left border-b border-gray-200">
                                    <th className="px-5 py-3">Phòng</th>
                                    <th className="px-5 py-3">Ngày Chuyển Vào</th>
                                    <th className="px-5 py-3 text-center">Xe Máy</th>
                                    <th className="px-5 py-3 text-center">Ô Tô</th>
                                    <th className="px-5 py-3 text-right">Diện tích</th>
                                    <th className="px-5 py-3 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {households.length > 0 ? (
                                    households.map((h) => (
                                        <tr key={h.id} className="hover:bg-gray-50 border-b border-gray-100 transition duration-150">
                                            {/* 1. Số phòng */}
                                            <td className="px-5 py-4 text-sm font-bold text-gray-800">
                                                {h.room}
                                            </td>

                                            {/* 3. Ngày chuyển vào */}
                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {formatDate(h.start_date)}
                                            </td>

                                            {/* 4. Xe cộ (Lưu ý key: number_motorbike) */}
                                            <td className="px-5 py-4 text-sm text-center text-gray-700 font-medium">
                                                {h.number_motorbike || h.number_motobike || 0}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-center text-gray-700 font-medium">
                                                {h.number_car || 0}
                                            </td>

                                            {/* 5. Diện tích */}
                                            <td className="px-5 py-4 text-sm text-right text-gray-700">
                                                {h.Room?.area} m²
                                            </td>

                                            {/* 6. Chi tiết */}
                                            <td className="px-5 py-4 text-sm text-center">
                                                <Link 
                                                    to={`/households/${h.id}`} 
                                                    className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-1 rounded font-medium transition"
                                                >
                                                    Xem & Quản lý
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10">
                                            <div className="text-4xl mb-2">🏢</div>
                                            <p className="text-gray-500 italic">Hiện không có hộ nào đang cư trú.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HouseholdList;