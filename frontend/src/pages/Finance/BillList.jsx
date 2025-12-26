import React, { useEffect, useState } from 'react';
import { getAllBills } from '../../api/financeService';
import { Link } from 'react-router-dom';

const BillList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await getAllBills();
            setBills(res.data?.data || res.data || []);
        } catch (error) {
            console.error("Lỗi tải bills:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A';

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">💰 Quản Lý Hóa Đơn & Đợt Thu</h1>
                    <p className="text-sm text-gray-500">Danh sách các đợt thu phí của tòa nhà</p>
                </div>
                <Link to="/finance/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow transition">
                    + Tạo Hóa Đơn Mới
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">Đang tải...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 text-xs uppercase font-bold text-left">
                                <th className="px-5 py-3">ID</th>
                                <th className="px-5 py-3">Tên Đợt Thu (Email/Title)</th>
                                <th className="px-5 py-3">Loại phí (Based)</th>
                                <th className="px-5 py-3">Hạn đóng</th>
                                <th className="px-5 py-3 text-center">Tác vụ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bills.map((bill) => (
                                <tr key={bill.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 font-mono text-sm">#{bill.id}</td>
                                    <td className="px-5 py-4 font-bold text-blue-900">{bill.email}</td>
                                    <td className="px-5 py-4 text-sm">
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                                            {bill.based}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-red-500 font-medium">
                                        {formatDate(bill.last_date)}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <Link 
                                            to={`/finance/bills/${bill.id}`}
                                            className="text-blue-600 hover:underline font-medium text-sm"
                                        >
                                            Xem chi tiết & Thu tiền
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BillList;