import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBillDetail, getPaymentStats, getBillPayments, createPayment } from '../../api/financeService';

const BillDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Data State
    const [bill, setBill] = useState(null);
    const [stats, setStats] = useState(null);
    const [payments, setPayments] = useState([]);
    
    // UI State
    const [showModal, setShowModal] = useState(false);
    const [payForm, setPayForm] = useState({ household_id: '', amount: '' });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            // Gọi song song 3 API để load dữ liệu nhanh hơn
            const [resBill, resStats, resList] = await Promise.all([
                getBillDetail(id),
                getPaymentStats(id),
                getBillPayments(id)
            ]);

            setBill(resBill.data?.data || resBill.data);
            setStats(resStats.data?.data || resStats.data); // Sửa tùy vào cấu trúc trả về thực tế
            setPayments(resList.data?.data || resList.data || []);
        } catch (error) {
            console.error("Lỗi tải chi tiết:", error);
        }
    };

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        try {
            await createPayment({
                bill_id: parseInt(id),
                household_id: parseInt(payForm.household_id),
                amount: parseInt(payForm.amount)
            });
            alert("✅ Thu tiền thành công!");
            setShowModal(false);
            setPayForm({ household_id: '', amount: '' });
            loadData(); // Load lại danh sách và thống kê
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    if (!bill) return <div className="p-10 text-center">Đang tải thông tin...</div>;

    return (
        <div className="space-y-6">
            {/* Header & Thống kê */}
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600 flex justify-between items-center">
                <div>
                    <button onClick={() => navigate('/finance/bills')} className="text-gray-500 text-sm hover:underline mb-2">⬅ Quay lại danh sách</button>
                    <h1 className="text-2xl font-bold text-gray-800">{bill.email}</h1>
                    <p className="text-gray-600">Loại phí: <span className="font-bold">{bill.based}</span> | Hạn đóng: {new Date(bill.last_date).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase">Tổng tiền đã thu</p>
                    {/* Giả sử API stats trả về field 'totalCollected' hoặc tương tự */}
                    <p className="text-3xl font-bold text-green-600">
                        {stats ? formatMoney(stats.total_amount || stats.total || 0) : '0 đ'}
                    </p>
                </div>
            </div>

            {/* Danh sách đã đóng tiền */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-700">📋 Danh sách hộ dân đã đóng tiền ({payments.length})</h3>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 shadow flex items-center gap-2"
                    >
                        + Tạo Phiếu Thu
                    </button>
                </div>
                
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 text-xs uppercase text-gray-600 font-semibold">
                            <th className="px-6 py-3">Mã GD</th>
                            <th className="px-6 py-3">Hộ Khẩu (ID)</th>
                            <th className="px-6 py-3">Số tiền</th>
                            <th className="px-6 py-3">Ngày thu</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payments.length > 0 ? payments.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500 text-sm">#{p.id}</td>
                                <td className="px-6 py-4 font-bold text-blue-800">
                                    Phòng {p.Household?.room || `ID: ${p.household_id}`}
                                </td>
                                <td className="px-6 py-4 font-bold text-green-700">
                                    {formatMoney(p.amount)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(p.createdAt || p.date).toLocaleString('vi-VN')}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-gray-400 italic">Chưa có khoản thu nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL TẠO PHIẾU THANH TOÁN */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="bg-green-600 px-6 py-4 flex justify-between items-center text-white">
                            <h3 className="font-bold text-lg">Thu Tiền / Tạo Payment</h3>
                            <button onClick={() => setShowModal(false)} className="text-2xl font-bold hover:text-gray-200">&times;</button>
                        </div>
                        
                        <form onSubmit={handleCreatePayment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Hộ Khẩu (ID)</label>
                                <input 
                                    type="number" required placeholder="Nhập ID hộ khẩu..."
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                                    value={payForm.household_id}
                                    onChange={e => setPayForm({...payForm, household_id: e.target.value})}
                                />
                                <p className="text-xs text-gray-500 mt-1">*Nhập ID của hộ gia đình cần nộp tiền.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền thu (VNĐ)</label>
                                <input 
                                    type="number" required placeholder="VD: 500000"
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none font-bold text-green-700"
                                    value={payForm.amount}
                                    onChange={e => setPayForm({...payForm, amount: e.target.value})}
                                />
                            </div>

                            <button className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition">
                                Xác Nhận Thu Tiền
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillDetail;