import React, { useEffect, useState } from 'react';
// 👇 1. Import hàm deleteBill
import { getAllBills, deleteBill } from '../../api/financeService';
import { Link, useNavigate } from 'react-router-dom';

const BillList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await getAllBills();
            const data = res.data?.data || res.data || [];
            // Sắp xếp ngày mới nhất lên đầu
            const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date)) : [];
            setBills(sortedData);
        } catch (error) {
            console.error("Lỗi tải bills:", error);
        } finally {
            setLoading(false);
        }
    };

    // 👇 2. Hàm xử lý Xóa
    const handleDelete = async (e, billId) => {
        // Ngăn chặn sự kiện click lan ra thẻ tr (để không bị chuyển trang)
        e.stopPropagation();

        if (window.confirm("⚠️ Bạn có chắc chắn muốn xóa đợt thu này?\nTất cả dữ liệu thanh toán liên quan sẽ bị mất vĩnh viễn!")) {
            try {
                await deleteBill(billId);
                alert("✅ Đã xóa thành công!");
                // Load lại danh sách
                fetchBills();
            } catch (error) {
                console.error(error);
                alert("❌ Lỗi: " + (error.response?.data?.message || "Không thể xóa."));
            }
        }
    };

    const formatDate = (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '---';

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-blue-900">💰 Quản Lý Thu Phí</h1>
                <Link to="/finance/create" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow flex items-center gap-2">
                    + Tạo Đợt Thu Mới
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
                ) : bills.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">Chưa có đợt thu nào.</div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-xs uppercase text-gray-500 font-bold text-left">
                                <th className="px-6 py-4">Tên Đợt Thu</th>
                                <th className="px-6 py-4 text-center">Hạn Nộp</th>
                                <th className="px-6 py-4 text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bills.map((bill) => (
                                <tr key={bill.id} className="hover:bg-blue-50 transition cursor-pointer" onClick={() => navigate(`/finance/bills/${bill.id}`)}>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800">{bill.name}</p>
                                        <p className="text-xs text-gray-400">Bắt đầu: {formatDate(bill.start_date)}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-red-500">
                                        {formatDate(bill.last_date)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button 
                                                className="text-blue-600 hover:underline text-sm font-bold"
                                                // Nút này để mặc định sẽ trigger onClick của tr
                                            >
                                                Chi tiết
                                            </button>
                                            <span className="text-gray-300">|</span>
                                            {/* 👇 Nút Xóa */}
                                            <button 
                                                onClick={(e) => handleDelete(e, bill.id)}
                                                className="text-red-500 hover:underline text-sm font-bold hover:bg-red-50 px-2 py-1 rounded"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BillList;