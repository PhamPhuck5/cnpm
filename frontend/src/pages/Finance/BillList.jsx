import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BillList = () => {
    // Dữ liệu giả lập vì Backend chưa có API lấy tất cả Bill cho Admin
    // Bạn cần viết API: GET /api/bills (Admin only)
    const [bills] = useState([
        { id: 101, room: '12', month: '12/2025', total: 1560000, status: 'Unpaid' },
        { id: 102, room: '34', month: '12/2025', total: 2100000, status: 'Paid' },
        { id: 103, room: '23', month: '12/2025', total: 850000, status: 'Unpaid' },
    ]);

    const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">💰 Quản Lý Thu Phí</h1>
                <Link to="/finance/create" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow transition">
                    + Tạo Đợt Thu Mới
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-green-50 text-green-800 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-3">Mã HĐ</th>
                            <th className="px-6 py-3">Phòng</th>
                            <th className="px-6 py-3">Tháng</th>
                            <th className="px-6 py-3 text-right">Tổng tiền</th>
                            <th className="px-6 py-3 text-center">Trạng thái</th>
                            <th className="px-6 py-3 text-center">Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bills.map((bill) => (
                            <tr key={bill.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-gray-500">#{bill.id}</td>
                                <td className="px-6 py-4 font-bold text-gray-800">P.{bill.room}</td>
                                <td className="px-6 py-4">{bill.month}</td>
                                <td className="px-6 py-4 text-right font-medium">{formatMoney(bill.total)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                        ${bill.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {bill.status === 'Paid' ? 'Đã thanh toán' : 'Chưa đóng'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {bill.status === 'Unpaid' && (
                                        <button className="text-blue-600 hover:underline text-sm font-medium">
                                            Thu tiền
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BillList;