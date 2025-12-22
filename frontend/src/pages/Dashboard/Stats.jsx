import React, { useEffect, useState } from 'react';
import { getMyApartmentBills, getPaymentStats, getPaidList } from '../../api/feeService';

const Stats = () => {
    const [bills, setBills] = useState([]);
    const [selectedBillId, setSelectedBillId] = useState('');
    const [stats, setStats] = useState({ totalCollected: 0, count: 0 }); // Tổng tiền & số người đóng
    const [paidList, setPaidList] = useState([]); // Danh sách chi tiết
    const [loading, setLoading] = useState(false);

    // 1. Tải danh sách các đợt thu khi vào trang
    useEffect(() => {
        const loadBills = async () => {
            try {
                const res = await getMyApartmentBills();
                const list = res.data || [];
                setBills(list);
                
                // Mặc định chọn bill mới nhất nếu có
                if (list.length > 0) {
                    setSelectedBillId(list[0].id);
                    fetchStatsData(list[0].id);
                }
            } catch (err) {
                console.error("Không tải được danh sách Bill:", err);
            }
        };
        loadBills();
    }, []);

    // 2. Hàm lấy thống kê chi tiết của một Bill
    const fetchStatsData = async (billId) => {
        if (!billId) return;
        setLoading(true);
        try {
            // Gọi song song 2 API: Lấy số liệu tổng & Lấy danh sách người đóng
            const [statsRes, listRes] = await Promise.all([
                getPaymentStats(billId),
                getPaidList(billId)
            ]);

            // Xử lý dữ liệu trả về từ API getPaymentStats
            // Backend trả về: { data: { totalCollected: "500000", totalPayments: 5 } }
            const statsData = statsRes.data || {};
            setStats({
                totalCollected: parseInt(statsData.totalCollected) || 0,
                count: parseInt(statsData.totalPayments) || 0
            });

            // Xử lý dữ liệu từ API getPaidList
            setPaidList(listRes.data || []);

        } catch (err) {
            console.error("Lỗi tải thống kê:", err);
            setStats({ totalCollected: 0, count: 0 });
            setPaidList([]);
        } finally {
            setLoading(false);
        }
    };

    // 3. Xử lý khi người dùng chọn Bill khác
    const handleBillChange = (e) => {
        const id = e.target.value;
        setSelectedBillId(id);
        fetchStatsData(id);
    };

    // Hàm format tiền tệ (VNĐ)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-blue-800 mb-6">Thống Kê Khoản Thu</h1>

            {/* PHẦN CHỌN BILL */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <label className="block text-gray-700 font-bold mb-2">Chọn đợt thu cần xem:</label>
                <select 
                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    value={selectedBillId}
                    onChange={handleBillChange}
                >
                    <option value="">-- Chọn khoản thu --</option>
                    {bills.map((bill) => (
                        <option key={bill.id} value={bill.id}>
                            {bill.name} (Hạn: {new Date(bill.last_date).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center p-10 text-gray-500">Đang tải dữ liệu...</div>
            ) : (
                <>
                    {/* CÁC THẺ THỐNG KÊ (DASHBOARD CARDS) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Card 1: Tổng tiền */}
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow text-white">
                            <h3 className="text-lg font-semibold opacity-80">Tổng thực thu</h3>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalCollected)}</p>
                            <p className="text-sm mt-1 opacity-70">Tiền mặt & Chuyển khoản</p>
                        </div>

                        {/* Card 2: Số hộ đã đóng */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow text-white">
                            <h3 className="text-lg font-semibold opacity-80">Số hộ đã đóng</h3>
                            <p className="text-3xl font-bold mt-2">{stats.count} <span className="text-lg font-normal">hộ</span></p>
                            <p className="text-sm mt-1 opacity-70">Trên tổng số hộ của tòa nhà</p>
                        </div>
                    </div>

                    {/* BẢNG CHI TIẾT DANH SÁCH ĐÃ ĐÓNG */}
                    <div className="bg-white rounded shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-700">Chi tiết giao dịch</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 border-b font-semibold text-gray-600">Mã Hộ</th>
                                        <th className="p-3 border-b font-semibold text-gray-600">Ngày nộp</th>
                                        <th className="p-3 border-b font-semibold text-gray-600">Người thu</th>
                                        <th className="p-3 border-b font-semibold text-gray-600 text-right">Số tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paidList.length > 0 ? (
                                        paidList.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50 transition">
                                                <td className="p-3 border-b">
                                                    {payment.Household ? `Phòng ${payment.Household.room}` : `Hộ ID: ${payment.household_id}`}
                                                </td>
                                                <td className="p-3 border-b text-gray-600">
                                                    {new Date(payment.date).toLocaleString()}
                                                </td>
                                                <td className="p-3 border-b text-gray-600">
                                                    {/* Nếu API trả về User collector thì hiển thị tên, ko thì hiện ID */}
                                                    {payment.User ? payment.User.name : `Admin ID: ${payment.collector}`}
                                                </td>
                                                <td className="p-3 border-b text-right font-bold text-green-600">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-6 text-center text-gray-400">
                                                Chưa có dữ liệu thanh toán nào cho đợt này.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Stats;