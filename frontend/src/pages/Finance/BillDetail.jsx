import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBillDetail, getPaymentStats, getBillPayments, updatePayment, createPayment } from '../../api/financeService';
import { getLivingHouseholds } from '../../api/managementService';

const BillDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bill, setBill] = useState(null);
    const [stats, setStats] = useState(null);
    const [payments, setPayments] = useState([]); 
    const [allHouseholds, setAllHouseholds] = useState([]); 
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unpaid', 'paid'
    const [searchTerm, setSearchTerm] = useState('');
    
    // State Modal Thu tiền
    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [inputRequire, setInputRequire] = useState('');
    const [inputAmount, setInputAmount] = useState('');

    // State Modal Thêm hộ mới
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createData, setCreateData] = useState({
        household_id: '',
        amount: 0
    });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [resBill, resStats, resList, resHouseholds] = await Promise.all([
                getBillDetail(id),
                getPaymentStats(id),
                getBillPayments(id),
                getLivingHouseholds()
            ]);
            setBill(resBill.data?.data || resBill.data);
            setStats(resStats.data?.data || resStats.data);
            
            let rawList = resList.data?.data || resList.data || [];
            
            rawList.sort((a, b) => {
                const isPaidA = a.amount >= a.require && a.require > 0;
                const isPaidB = b.amount >= b.require && b.require > 0;
                if (!isPaidA && isPaidB) return -1;
                if (isPaidA && !isPaidB) return 1;
                return 0; 
            });

            setPayments(rawList);
            setAllHouseholds(resHouseholds.data?.data || resHouseholds.data || []);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    };

    // --- LOGIC LỌC DANH SÁCH ---
    const filteredPayments = payments.filter(p => {
        const isPaid = p.amount >= p.require && p.require > 0;
        
        if (filterStatus === 'unpaid' && isPaid) return false;
        if (filterStatus === 'paid' && !isPaid) return false;

        const roomName = p.Household?.room || String(p.household_id);
        if (searchTerm && !roomName.toLowerCase().includes(searchTerm.toLowerCase())) return false;

        return true;
    });

    // --- LOGIC LỌC DROPDOWN THÊM MỚI ---
    const availableHouseholds = allHouseholds.filter(h => 
        !payments.some(p => p.household_id === h.id)
    );

    // --- XỬ LÝ: MỞ MODAL THU TIỀN ---
    const handleOpenPayModal = (paymentItem) => {
        setSelectedPayment(paymentItem);
        setInputRequire(paymentItem.require > 0 ? paymentItem.require : '');
        setInputAmount(paymentItem.amount > 0 ? paymentItem.amount : '');
        setShowModal(true);
    };

    // --- XỬ LÝ: XÁC NHẬN THU TIỀN (UPDATE) ---
    const handleConfirmPayment = async (e) => {
        e.preventDefault();
        if (!selectedPayment) return;
        try {
            // Chuẩn bị payload cơ bản
            const payload = {
                bill_id: parseInt(id),
                household_id: selectedPayment.household_id,
                amount: parseInt(inputAmount) || 0,
            };

            // LOGIC QUAN TRỌNG:
            // Chỉ gửi 'require' nếu đây là phí Tự nguyện (voluntary).
            // Nếu là phí cố định (Xe, Diện tích...), Backend cấm sửa require -> Không gửi field này.
            if (bill && bill.based === 'voluntary') {
                payload.require = parseInt(inputRequire) || 0;
            }

            await updatePayment(selectedPayment.id, payload);
            alert("✅ Đã cập nhật thành công!");
            setShowModal(false);
            loadData(); 
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    // --- XỬ LÝ: THÊM HỘ MỚI (CREATE) ---
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!createData.household_id) {
            alert("Vui lòng chọn hộ khẩu!");
            return;
        }

        try {
            const payload = {
                bill_id: parseInt(id),
                household_id: parseInt(createData.household_id),
                amount: parseInt(createData.amount) || 0
            };

            await createPayment(payload);

            alert("✅ Đã thêm hộ vào danh sách thu!");
            setShowCreateModal(false);
            setCreateData({ household_id: '', amount: 0 }); // Reset form
            loadData(); 
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '---';

    if (!bill) return <div className="p-10 text-center">Đang tải...</div>;

    // Biến kiểm tra xem có được phép sửa số tiền phải thu không
    const canEditRequire = bill.based === 'voluntary';

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600 flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <button onClick={() => navigate('/finance/bills')} className="text-gray-500 hover:text-blue-600 mb-2 font-medium text-sm">⬅ Quay lại danh sách</button>
                    <h1 className="text-2xl font-bold text-gray-800">{bill.name}</h1>
                    <p className="text-sm text-gray-600 mt-1">Hạn nộp: <span className="font-bold text-red-500">{formatDate(bill.last_date)}</span></p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="text-right bg-blue-50 px-4 py-2 rounded-lg">
                        <p className="text-xs text-blue-500 uppercase font-bold">Tổng tiền thực thu</p>
                        <p className="text-2xl font-bold text-blue-700">{formatMoney(stats?.totalCollected)}</p>
                    </div>
                    {/* Nút thêm hộ */}
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow transition flex items-center gap-2"
                    >
                        + Thêm Hộ
                    </button>
                </div>
            </div>

            {/* THANH CÔNG CỤ: TÌM KIẾM + BỘ LỌC */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                    <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${filterStatus === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>Tất cả ({payments.length})</button>
                    <button onClick={() => setFilterStatus('unpaid')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${filterStatus === 'unpaid' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-50'}`}>Chưa nộp</button>
                    <button onClick={() => setFilterStatus('paid')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${filterStatus === 'paid' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}>Đã nộp</button>
                </div>

                <div className="relative w-full md:w-64">
                    <input type="text" placeholder="🔍 Tìm theo số phòng..." className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <span className="absolute left-3 top-2.5 text-gray-400">#</span>
                </div>
            </div>

            {/* DANH SÁCH */}
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100 text-xs uppercase text-gray-500 font-bold text-left">
                            <th className="px-6 py-4">Hộ</th>
                            <th className="px-6 py-4 text-right">Phải thu</th>
                            <th className="px-6 py-4 text-right">Đã nộp</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((p) => {
                                const isPaid = p.amount >= p.require && p.require > 0;
                                let displayRoom = `Hộ #${p.household_id}`;
                                if (p.Household) {
                                    const rName = p.Household.room || p.Household.name;
                                    if (rName) displayRoom = `Phòng ${rName}`;
                                }

                                return (
                                    <tr key={p.id} className={`hover:bg-gray-50 transition ${!isPaid ? 'bg-red-50/30' : ''}`}>
                                        <td className="px-6 py-4"><p className="font-bold text-gray-800 text-lg">{displayRoom}</p></td>
                                        <td className="px-6 py-4 text-right text-gray-600 font-medium">{formatMoney(p.require)}</td>
                                        <td className="px-6 py-4 text-right font-bold text-blue-700">{formatMoney(p.amount)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{isPaid ? 'Đã xong' : 'Chưa nộp'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleOpenPayModal(p)} className={`text-xs font-bold px-4 py-2 rounded shadow transition text-white ${isPaid ? 'bg-gray-400 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}>{isPaid ? 'Sửa' : 'Thu tiền'}</button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="5" className="text-center py-10 text-gray-400 italic">Không tìm thấy kết quả nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL 1: SỬA/THU TIỀN */}
            {showModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-bold text-lg text-blue-800">Cập nhật thanh toán</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <form onSubmit={handleConfirmPayment} className="space-y-4">
                            <div className="text-center bg-gray-50 p-3 rounded">
                                <p className="text-gray-500 text-sm">Đang nhập cho</p>
                                <p className="text-xl font-bold text-gray-800">{selectedPayment.Household?.room ? `Phòng ${selectedPayment.Household.room}` : `Hộ #${selectedPayment.household_id}`}</p>
                            </div>
                            
                            {/* 🔥 GIAO DIỆN ĐÃ SỬA: Khóa ô nhập nếu không được phép sửa */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Số tiền PHẢI THU (VNĐ) {canEditRequire ? '' : '(Cố định)'}
                                </label>
                                <input 
                                    type="number" 
                                    min="0" 
                                    // Nếu không phải phí tự nguyện thì ReadOnly và màu xám
                                    readOnly={!canEditRequire}
                                    className={`w-full border p-2.5 rounded font-bold ${!canEditRequire ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white focus:ring-2 focus:ring-blue-500'}`}
                                    value={inputRequire} 
                                    onChange={e => setInputRequire(e.target.value)} 
                                />
                                {!canEditRequire && <p className="text-xs text-red-400 mt-1 italic">*Phí cố định, không thể sửa tay.</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Số tiền KHÁCH ĐÓNG (VNĐ)</label>
                                <input type="number" min="0" required className="w-full border p-2.5 rounded font-bold text-green-700" value={inputAmount} onChange={e => setInputAmount(e.target.value)} />
                            </div>
                            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 mt-2">Xác Nhận Lưu</button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: THÊM HỘ MỚI */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-bold text-lg text-green-700">Thêm Hộ Vào Đợt Thu</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Chọn Hộ / Phòng (*)</label>
                                <select 
                                    required
                                    className="w-full border p-2.5 rounded bg-white focus:ring-2 focus:ring-green-500"
                                    value={createData.household_id}
                                    onChange={e => setCreateData({...createData, household_id: e.target.value})}
                                >
                                    <option value="">-- Vui lòng chọn hộ --</option>
                                    {availableHouseholds.length > 0 ? (
                                        availableHouseholds.map(h => (
                                            <option key={h.id} value={h.id}>
                                                {h.room ? `Phòng ${h.room}` : `Hộ #${h.id}`}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Tất cả các hộ đã có trong danh sách!</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Số tiền đóng ngay (VNĐ)</label>
                                <input 
                                    type="number" min="0" 
                                    placeholder="Để 0 nếu chưa đóng"
                                    className="w-full border p-2.5 rounded font-bold text-green-700"
                                    value={createData.amount}
                                    onChange={e => setCreateData({...createData, amount: e.target.value})}
                                />
                            </div>
                            <button className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 mt-2">Xác Nhận Thêm</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillDetail;