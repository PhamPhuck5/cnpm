import React, { useEffect, useState } from 'react';
import { getAllHouseholds } from '../../api/managementService';
import { Link } from 'react-router-dom';

const HouseholdList = () => {
    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getAllHouseholds();
            console.log("Dữ liệu danh sách hộ:", res); // Log để kiểm tra cấu trúc

            // Dựa vào Controller backend bạn cung cấp: return res.status(200).json({ data: households })
            // Thì dữ liệu mảng sẽ nằm ở res.data.data (nếu dùng axios interceptor chuẩn) hoặc res.data
            // Đoạn này tôi viết bao quát cả 2 trường hợp để chắc chắn không bị lỗi
            const dataArray = res.data?.data || res.data || [];
            
            setHouseholds(dataArray);
        } catch (err) {
            console.error("Lỗi tải danh sách hộ:", err);
            alert("Không thể tải danh sách hộ khẩu.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm format tiền tệ (VND)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Hàm format ngày tháng (dd/mm/yyyy)
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">📋 Quản Lý Danh Sách Hộ Khẩu</h1>
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
                                    <th className="px-5 py-3">Loại Căn Hộ</th>
                                    <th className="px-5 py-3">Ngày Chuyển Vào</th>
                                    <th className="px-5 py-3 text-center">Xe Máy</th>
                                    <th className="px-5 py-3 text-center">Ô Tô</th>
                                    <th className="px-5 py-3 text-right">Phí DV / m²</th>
                                    <th className="px-5 py-3 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {households.length > 0 ? (
                                    households.map((h) => (
                                        <tr key={h.id} className="hover:bg-gray-50 border-b border-gray-100 transition duration-150">
                                            {/* 1. Tên căn hộ (Dùng biến 'room' khớp backend) */}
                                            <td className="px-5 py-4 text-sm font-bold text-gray-800">
                                                {h.room || h.apartment_id}
                                            </td>

                                            {/* 2. Loại căn hộ */}
                                            <td className="px-5 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${h.type === 'Penthouse' ? 'bg-purple-100 text-purple-700' :
                                                      h.type === 'Kiot' ? 'bg-orange-100 text-orange-700' :
                                                      h.type === 'Văn phòng' ? 'bg-gray-100 text-gray-700' :
                                                      'bg-green-100 text-green-700'}`}>
                                                    {h.type}
                                                </span>
                                            </td>

                                            {/* 3. Ngày chuyển vào */}
                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {formatDate(h.start_date)}
                                            </td>

                                            {/* 4. Số xe máy */}
                                            <td className="px-5 py-4 text-sm text-center text-gray-700 font-medium">
                                                {h.number_motobike ?? 0}
                                            </td>

                                            {/* 5. Số ô tô */}
                                            <td className="px-5 py-4 text-sm text-center text-gray-700 font-medium">
                                                {h.number_car}
                                            </td>

                                            {/* 6. Phí dịch vụ */}
                                            <td className="px-5 py-4 text-sm text-right text-gray-700">
                                                {formatCurrency(h.feePerMeter)}
                                            </td>

                                            {/* 7. Hành động */}
                                            <td className="px-5 py-4 text-sm text-center">
                                                <Link 
                                                    to={`/households/${h.id}`} 
                                                    className="text-blue-600 hover:text-blue-900 hover:underline font-medium"
                                                >
                                                    Chi tiết
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                                            Chưa có dữ liệu hộ khẩu nào. Hãy thêm mới!
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